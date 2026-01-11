import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function YBot() {
  const { scene } = useGLTF("/models/model.glb");
  return <primitive object={scene} />;
}

function SectionModel({ modelPath, section, color }) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef(null);
  const clonedScene = useRef(scene.clone());

  if (clonedScene.current) {
    clonedScene.current.traverse((child) => {
      if (child.isMesh && child.material && color) {
        child.material.color = new THREE.Color(color);
        child.material.needsUpdate = true;
      }
    });
  }

  const coords = {
    top: [0, -0.08, 0.02],
    bottom: [0, -0.095, -0.01],
    sleeves: [0, -0.08, 0.02],
  };

  const scales = {
    top: [1.05, 1.05, 1.05],
    bottom: [1.09, 1.06, 1.05],
    sleeves: [1.05, 1.05, 1.05],
  };

  const sideOffset = section === "bottom" ? -1.5 : 1.5;

  useFrame((_state, delta) => {
    if (ref.current) {
      const targetPos = new THREE.Vector3(...coords[section]);
      ref.current.position.lerp(targetPos, delta * 5);
      ref.current.scale.lerp(new THREE.Vector3(...scales[section]), delta * 5);
    }
  });

  return (
    <primitive
      ref={ref}
      object={clonedScene.current}
      scale={0}
      position={[sideOffset, -0.5, 0]}
    />
  );
}

export default function Scene({ fabricModels, topColor, bottomColor }) {

  return (
    <>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        <YBot />

        {fabricModels?.top && (
          <SectionModel
            key={`top-${fabricModels.top}`}
            modelPath={fabricModels.top}
            section="top"
            color={topColor}
          />
        )}

        {fabricModels?.bottom && (
          <SectionModel
            key={`bottom-${fabricModels.bottom}`}
            modelPath={fabricModels.bottom}
            section="bottom"
            color={bottomColor}
          />
        )}

        {fabricModels?.sleeves && (
          <SectionModel
            key={`sleeves-${fabricModels.sleeves}`}
            modelPath={fabricModels.sleeves}
            section="sleeves"
            color={topColor}
          />
        )}

        <OrbitControls minDistance={2} maxDistance={10} target={[0, 1, 0]} />
      </Canvas>
    </>
  );
}
