import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud, CameraControls, Sky as SkyImpl } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function App() {
  // Gestisce la dimensione del Canvas quando la finestra viene ridimensionata
  useEffect(() => {
    const handleResize = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Imposta la dimensione iniziale

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="weather-animation">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, -10, 10], fov: 75 }} style={{ pointerEvents: "none" }}>
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
    if (ref.current) {
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime / 2) / 2;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2;
    }
    if (cloud0.current) {
      cloud0.current.rotation.y -= delta;
    }
  });

  useEffect(() => {
    // Gestione del contesto WebGL
    const canvas = document.querySelector('canvas');
    const handleContextLost = (event) => {
      event.preventDefault();
      console.log('WebGL context lost!');
      // Aggiungi logica per ripristinare il contesto se necessario
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored!');
      // Aggiungi logica per ripristinare la scena se necessario
    };

    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={200} range={200}>
          <Cloud ref={cloud0} fade={10} speed={0.1} growth={4} volume={6} opacity={0.3} bounds={[6, 1, 1]} color="white" />
          <Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.3} bounds={[6, 1, 1]} color="#eed0d0" seed={2} position={[15, 0, 0]} />
          <Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.3} bounds={[6, 1, 1]} color="#d0e0d0" seed={3} position={[-15, 0, 0]} />
          {/*<Cloud fade={10} speed={0.1} growth={4} volume={6} opacity={0.8} bounds={[6, 1, 1]} color="#c0c0dd" seed={5} position={[0, 0, 12]} />
          <Cloud concentrate="outside" growth={100} color="#ffccdd" opacity={1.25} seed={0.3} bounds={200} volume={200} />*/}
        </Clouds>
      </group>
    </>
  );
}
