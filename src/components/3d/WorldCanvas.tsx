import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Stars } from '@react-three/drei';
import { Atmosphere } from './Atmosphere';
import { FloatingIsland } from './FloatingIsland';
import { WorldLandmarks } from './Landmarks';
import { WorldProps } from './WorldProps';
import { HoverPlayer } from './HoverPlayer';
import { TimeTrialTrack } from './TimeTrialTrack';
import { WorldHUD } from './WorldHUD';
import { worldStore } from '../../context/World3DState';

export const WorldCanvas: React.FC = () => {
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    // Reset store states when unmounting
    return () => {
      worldStore.reset();
    };
  }, []);

  if (hasWebGlError) {
    return (
      <div className="w3d-root flex items-center justify-center p-6 text-center text-white">
        <div className="max-w-md glass-panel p-8 rounded-2xl border border-red-500/50">
          <h2 className="text-xl font-bold text-red-400">WebGL Not Available</h2>
          <p className="text-sm text-slate-300 mt-2">
            Your browser or device does not support hardware accelerated 3D graphics. You can still explore the full 2D classic portfolio!
          </p>
          <button
            type="button"
            onClick={() => worldStore.setIs3DActive(false)}
            className="btn-3d-world mt-5 text-xs py-2 px-4"
          >
            Back to Classic Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w3d-root">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ fov: 56, near: 0.5, far: 400, position: [0, 8, 26] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
        onError={() => setHasWebGlError(true)}
      >
        {/* Sky shader & lighting */}
        <Atmosphere />

        {/* Ambient starfield */}
        <Stars radius={200} depth={70} count={1600} factor={4.5} fade speed={0.5} />

        {/* Atmospheric fog */}
        <fog attach="fog" args={['#3b2c6e', 100, 290]} />

        {/* Physics simulation */}
        <Suspense fallback={null}>
          <Physics gravity={[0, -32, 0]} timeStep={1 / 60}>
            <FloatingIsland />
            <WorldLandmarks />
            <WorldProps />
            <TimeTrialTrack />
            <HoverPlayer />
          </Physics>
        </Suspense>
      </Canvas>

      {/* 2D HUD UI on top of 3D Canvas */}
      <WorldHUD />
    </div>
  );
};
