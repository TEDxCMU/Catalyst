import { Canvas, useLoader } from 'react-three-fiber';
import * as THREE from 'three';

import Effects from './effects';
import Mesh from './mesh';

function ThreeCanvas({ image, width, height }) {
    const texture = useLoader(THREE.TextureLoader, image);

    return (
        <Canvas id="stage" shadowMap colorManagement camera={{ position: [0, 0, 7] }}>
            <Effects />
            <Mesh texture={texture} width={width} height={height} />
        </Canvas>
    );
}

export default ThreeCanvas;
