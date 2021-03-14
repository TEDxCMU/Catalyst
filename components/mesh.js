import { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { shaderMaterial } from 'drei';

const MeshShader = shaderMaterial(
    {
        time: 0,
        progress: 0,
        angle: 0,
        texture1: undefined,
        resolution: new THREE.Vector4(),
        uvRate1: new THREE.Vector2(1, 1),
    },
    `
        uniform float time;
        uniform float progress;
        uniform vec4 resolution;
        uniform sampler2D texture1;
        
        varying vec2 vUv;
        
        const float pi = 3.1415925;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    `
        uniform float time;
        uniform float progress;
        uniform sampler2D texture1;
        uniform vec4 resolution;
        
        varying vec2 vUv;
        
        void main()	{
            vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
            gl_FragColor = texture2D(texture1, newUV);
        }
    `
);

extend({ MeshShader });

function Mesh({ texture, width, height }) {
    const mesh = useRef(null);
    const { size } = useThree();

    useFrame((_, delta) => {
        if (mesh.current.material.uniforms) {
            mesh.current.material.uniforms.angle.value += 0.3;
            mesh.current.material.uniforms.time.value += delta;
            mesh.current.material.needsUpdate = true;
        }
    });

    return (
        <mesh ref={mesh}>
            <planeBufferGeometry attach="geometry" args={[width / 75, height / 75, 80, 80]} />
            <meshShader
                attach="material"
                texture1={texture}
                resolution={new THREE.Vector4(size.width, size.height, 1, size.height / size.width / (size.height / size.width))}
            />
        </mesh>
    )
}

export default Mesh;
