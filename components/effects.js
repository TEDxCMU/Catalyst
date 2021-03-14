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
            mouse.current.x = (position[0] / size.width);
            mouse.current.y = 1 - (position[1] / size.height);
        });
    }, []);

    useEffect(() => {
        void composer.current.setSize(size.width, size.height);
    }, [size]);

    useFrame((_, delta) => {
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

        composer.current.render();
    }, 1);

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
                        resolution: { value: new THREE.Vector2(1.0, size.height / size.width) },
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
                        
                        void main()	{
                            vec2 newUV = vUv;
                            vec4 color = vec4(1.,0.,0.,1.);
                            
                            float c = circle(newUV, uMouse, 0.0, 0.1+uVelo*2.)*40.*uVelo;
                            vec2 offsetVector = normalize(uMouse - vUv);
                            vec2 warpedUV = mix(vUv, uMouse, c * 0.99); //power
                            color = texture2D(tDiffuse,warpedUV) + texture2D(tDiffuse,warpedUV)*vec4(vec3(c),1.);
                            
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
