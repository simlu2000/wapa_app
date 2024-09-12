import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud, CameraControls, Sky as SkyImpl } from "@react-three/drei";
import { useRef } from "react";
export default function App() {
  return (
    <div className="weather-animation">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, -10, 10], fov: 75 }}>
          <Sky />
          <ambientLight intensity={Math.PI / 1.5} />
          <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={100} />
          <spotLight position={[-20, 0, 10]} color="red" angle={0.15} decay={0} penumbra={-1} intensity={30} />
          <spotLight position={[20, -10, 10]} color="red" angle={0.2} decay={0} penumbra={-1} intensity={20} />
          <CameraControls
            zoomSpeed={0}
            maxDistance={15}
            minDistance={10}
            enabled={true}
            mouseButtons={{
              LEFT: null,   // Disabilita la rotazione con il pulsante sinistro del mouse
              MIDDLE: null, // Disabilita lo zoom con il pulsante centrale del mouse
              RIGHT: null,  // Disabilita il pan con il pulsante destro del mouse
            }}
            touches={{
              ONE: null,    // Disabilita la rotazione con un dito
              TWO: null,    // Disabilita il pinch-to-zoom con due dita
            }}
          />
        </Canvas>
      </div>
      <div className="centered-text">
        <h1 id="intro-title">Exact weather</h1>
        <h2 id="into-subtitle">exactly for you</h2>
      </div>
    </div>
  );
}

function Sky() {
  const ref = useRef();
  const cloud0 = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 2) / 2;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2;
    cloud0.current.rotation.y -= delta;
  });

  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={400}>
          <Cloud ref={cloud0} fade={10} speed={0.1} growth={4} volume={6} opacity={0.8} bounds={[6, 1, 1]} color="white" />
          <Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.8} bounds={[6, 1, 1]} color="#eed0d0" seed={2} position={[15, 0, 0]} />
          <Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.8} bounds={[6, 1, 1]} color="#d0e0d0" seed={3} position={[-15, 0, 0]} />
          <Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.8} bounds={[6, 1, 1]} color="#a0b0d0" seed={4} position={[0, 0, -12]} />
          <Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.8} bounds={[6, 1, 1]} color="#c0c0dd" seed={5} position={[0, 0, 12]} />
          <Cloud concentrate="outside" growth={100} color="#ffccdd" opacity={1.25} seed={0.3} bounds={200} volume={200} />
        </Clouds>
      </group>
    </>
  );
}