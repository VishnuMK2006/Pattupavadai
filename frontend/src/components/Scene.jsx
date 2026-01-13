import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box, Typography } from "@mui/material";
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

export default function Scene({ fabricModels, topColor, bottomColor, selectedTopStyle, selectedBottomStyle, onTopStyleSelect, onBottomStyleSelect }) {
  const topStyles = [
    { id: 't1', name: 'Top Style 1' },
    { id: 't2', name: 'Top Style 2' },
    { id: 't3', name: 'Top Style 3' },
    { id: 't4', name: 'Top Style 4' },
  ];

  const bottomStyles = [
    { id: 'p1', name: 'Bottom Style 1' },
    { id: 'p2', name: 'Bottom Style 2' },
    { id: 'p3', name: 'Bottom Style 3' },
    { id: 'p4', name: 'Bottom Style 4' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 115,
        left: 0,
        width: '400px',
        bottom: 80,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E0E0E0',
      }}
    >
      {/* 3D Model Canvas - Top Section */}
      <Box
        sx={{
          height: '60%',
          bgcolor: '#FFFFFF',
        }}
      >
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

          <OrbitControls target={[0, 1, 0]} enableZoom={true} />
        </Canvas>
      </Box>

      {/* Dress Selection - Bottom Section */}
      <Box
        sx={{
          height: '40%',
          p: 2,
          overflowY: 'auto',
          bgcolor: '#F9F9F9',
          borderTop: '1px solid #E0E0E0',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {/* Top Styles */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#111111',
              mb: 1.5,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Top Styles
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {topStyles.map((style) => (
              <Box
                key={style.id}
                onClick={() => onTopStyleSelect(style.id)}
                sx={{
                  width: '80px',
                  height: '80px',
                  border: selectedTopStyle === style.id ? '2px solid #2874F0' : '1px solid #CCCCCC',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: '#FFFFFF',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#2874F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  {style.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom Styles (Pants) */}
        <Box>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#111111',
              mb: 1.5,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Bottom Styles
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {bottomStyles.map((style) => (
              <Box
                key={style.id}
                onClick={() => onBottomStyleSelect(style.id)}
                sx={{
                  width: '80px',
                  height: '80px',
                  border: selectedBottomStyle === style.id ? '2px solid #2874F0' : '1px solid #CCCCCC',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: '#FFFFFF',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#2874F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  {style.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
