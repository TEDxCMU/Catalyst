import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import createInputEvents from 'simple-input-events';
import { useThree, useFrame, extend } from 'react-three-fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

extend({ EffectComposer, RenderPass, ShaderPass });

function Effects() {
    const composer = useRef();
    const customPass = useRef();
    const mouse = useRef(new THREE.Vector2());
    const followMouse = useRef(new THREE.Vector2());
    const previousMouse = useRef(new THREE.Vector2());
    const targetSpeed = useRef(0);
    const { gl, scene, camera, size } = useThree();

    useEffect(() => {
        const event = createInputEvents(window);
        event.on('move', ({ position }) => {
            mouse.current.x = (position[0] / window.innerWidth);
            mouse.current.y = 1 - (position[1] / window.innerHeight);
        });
    }, []);

    useEffect(() => {
        void composer.current.setSize(size.width, size.height);
    }, [size]);

    useFrame((state, delta) => {
        const speed = Math.sqrt((previousMouse.current.x - mouse.current.x)**2 + (previousMouse.current.y- mouse.current.y)**2);
        targetSpeed.current -= 0.1 * (targetSpeed.current - speed);
        followMouse.current.x -= 0.1 * (followMouse.current.x - mouse.current.x);
        followMouse.current.y -= 0.1 * (followMouse.current.y - mouse.current.y);
        previousMouse.current.x = mouse.current.x;
        previousMouse.current.y = mouse.current.y;

        customPass.current.uniforms.time.value += delta;
        customPass.current.uniforms.uMouse.value = followMouse.current;
        customPass.current.uniforms.uVelo.value = Math.min(targetSpeed.current, 0.05);
        targetSpeed.current *= 0.999;

        if (composer.current) {
            composer.current.render();
        }
    });

    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass
                attachArray="passes"
                args={[scene, camera]}
                scene={scene}
                camera={camera}
            />
            <shaderPass
                ref={customPass}
                attachArray="passes"
                args={[{
                    uniforms: {
                        tDiffuse: { value: null },
                        distort: { value: 0 },
                        resolution: { value: new THREE.Vector2(1.0, window.innerHeight / window.innerWidth) },
                        uMouse: { value: new THREE.Vector2(-10,-10) },
                        uVelo: { value: 0 },
                        uScale: { value: 0 },
                        uType: { value: 1 },
                        time: { value: 0 }
                    },
                    vertexShader: `
                        uniform float time;
                        uniform float progress;
                        uniform vec2 resolution;
                        varying vec2 vUv;
                        uniform sampler2D texture1;
                        
                        const float pi = 3.1415925;
                        
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
                        }
                    `,
                    fragmentShader: `
                        uniform float time;
                        uniform float progress;
                        uniform sampler2D tDiffuse;
                        uniform vec2 resolution;
                        varying vec2 vUv;
                        uniform vec2 uMouse;
                        uniform float uVelo;
                        uniform int uType;

                        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
                            uv -= disc_center;
                            uv*=resolution;
                            float dist = sqrt(dot(uv, uv));
                            return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
                        }
                    
                        float map(float value, float min1, float max1, float min2, float max2) {
                            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                        }
                    
                        float remap(float value, float inMin, float inMax, float outMin, float outMax) {
                            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
                        }
                    
                        float hash12(vec2 p) {
                            float h = dot(p,vec2(127.1,311.7));	
                            return fract(sin(h)*43758.5453123);
                        }
                    
                        // #define HASHSCALE3 vec3(.1031, .1030, .0973)
                        vec2 hash2d(vec2 p) {
                            vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
                            p3 += dot(p3, p3.yzx+19.19);
                            return fract((p3.xx+p3.yz)*p3.zy);
                        }
                        
                        void main()	{
                            vec2 newUV = vUv;
                            vec4 color = vec4(1.,0.,0.,1.);
                            
                            // colorful
                            if(uType==0){
                                float c = circle(newUV, uMouse, 0.0, 0.2);
                                float r = texture2D(tDiffuse, newUV.xy += c * (uVelo * .5)).x;
                                float g = texture2D(tDiffuse, newUV.xy += c * (uVelo * .525)).y;
                                float b = texture2D(tDiffuse, newUV.xy += c * (uVelo * .55)).z;
                                color = vec4(r, g, b, 1.);
                            }
                        
                            // zoom
                            if(uType==1){
                                float c = circle(newUV, uMouse, 0.0, 0.1+uVelo*2.)*40.*uVelo;
                                vec2 offsetVector = normalize(uMouse - vUv);
                                vec2 warpedUV = mix(vUv, uMouse, c * 0.99); //power
                                color = texture2D(tDiffuse,warpedUV) + texture2D(tDiffuse,warpedUV)*vec4(vec3(c),1.);
                            }
                        
                            // zoom
                            if(uType==2){
                                float hash = hash12(vUv*10.);
                                // float c = -circle(newUV, uMouse, 0.0, 0.1+uVelo*2.)*40.*uVelo;
                                // vec2 offsetVector = -normalize(uMouse - vUv);
                                // vec2 warpedUV = mix(vUv, uMouse, c * 0.6); //power
                                // vec2 warpedUV1 = mix(vUv, uMouse, c * 0.3); //power
                                // vec2 warpedUV2 = mix(vUv, uMouse, c * 0.1); //power
                                // color = vec4(
                                // 	texture2D(tDiffuse,warpedUV ).r,
                                // 	texture2D(tDiffuse,warpedUV1 ).g,
                                // 	texture2D(tDiffuse,warpedUV2 ).b,
                                // 	1.);
                                // color = vec4(,0.,0.,1.);
                                float c = circle(newUV, uMouse, 0.0, 0.1+uVelo*0.01)*10.*uVelo;
                                vec2 offsetVector = normalize(uMouse - vUv);
                                // vec2 warpedUV = mix(vUv, uMouse,  20.*hash*c); //power
                                vec2 warpedUV = vUv + vec2(hash - 0.5)*c; //power
                                color = texture2D(tDiffuse,warpedUV) + texture2D(tDiffuse,warpedUV)*vec4(vec3(c),1.);
                            }
                
                            gl_FragColor = color;
                        }
                    `
                }]}
                renderToScreen
            />
        </effectComposer>
    )
}

export default Effects;
