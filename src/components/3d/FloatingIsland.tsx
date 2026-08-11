import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

// Deterministic RNG
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Stylized Cyber Crystal Flora & Pyramids
const CyberFlora: React.FC = () => {
  const scenery = useMemo(() => {
    const rng = createRng(55);
    const items: Array<{
      position: [number, number, number];
      scale: number;
      rotation: number;
      kind: 'crystalTree' | 'cyberObelisk';
      color: string;
    }> = [];

    const isSafeLocation = (x: number, z: number) => {
      const tooCloseToLandmark = PORTFOLIO_DATA.world3d.zones.some(
        zObj => Math.hypot(x - zObj.position[0], z - zObj.position[2]) < zObj.radius + 3
      );
      const tooCloseToSpawn = Math.hypot(x - PORTFOLIO_DATA.world3d.spawnPoint[0], z - PORTFOLIO_DATA.world3d.spawnPoint[2]) < 8;
      return !tooCloseToLandmark && !tooCloseToSpawn;
    };

    const colors = ['#00f5ff', '#a855f7', '#ff007f', '#00ff88', '#38bdf8'];

    let attempts = 0;
    while (items.length < 46 && attempts < 800) {
      attempts++;
      const angle = rng() * Math.PI * 2;
      const radius = 12 + 45 * rng();
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.7 + 1.3 * rng();
      const rot = rng() * Math.PI * 2;
      const kind = rng() > 0.4 ? 'crystalTree' : 'cyberObelisk';
      const color = colors[Math.floor(rng() * colors.length)];

      if (isSafeLocation(x, z)) {
        items.push({ position: [x, 0, z], scale, rotation: rot, kind, color });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {scenery.map((item, idx) =>
        item.kind === 'crystalTree' ? (
          <group key={idx} position={item.position} rotation={[0, item.rotation, 0]} scale={item.scale}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.18, 1, 6]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Tier 1 Crystal Foliage */}
            <mesh position={[0, 1.4, 0]} castShadow>
              <coneGeometry args={[0.85, 1.6, 6]} />
              <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.4} metalness={0.6} roughness={0.2} flatShading />
            </mesh>
            {/* Tier 2 Crystal Foliage */}
            <mesh position={[0, 2.3, 0]} castShadow>
              <coneGeometry args={[0.6, 1.2, 6]} />
              <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.6} metalness={0.6} roughness={0.2} flatShading />
            </mesh>
          </group>
        ) : (
          <mesh
            key={idx}
            position={[item.position[0], 0.7 * item.scale, item.position[2]]}
            rotation={[0, item.rotation, 0]}
            scale={0.7 * item.scale}
            castShadow
          >
            <octahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.5} roughness={0.2} metalness={0.7} flatShading />
          </mesh>
        )
      )}
    </group>
  );
};

export const FloatingIsland: React.FC = () => {
  return (
    <group>
      {/* Physics Floor */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[8, 62]} position={[0, -8, 0]} friction={1} />
        {/* Island top platform surface */}
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <cylinderGeometry args={[62, 58, 1, 96]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.7} metalness={0.4} />
        </mesh>
      </RigidBody>

      {/* Cyberpunk Neon Hex Grid Overlay */}
      <gridHelper args={[124, 62, '#00f5ff', '#1e293b']} position={[0, 0.02, 0]} />

      {/* Outer Laser Boundary Ring */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[56.6, 57.4, 96]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.8} toneMapped={false} />
      </mesh>

      {/* Secondary Inner Pulse Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[42, 42.4, 80]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.4} toneMapped={false} />
      </mesh>

      {/* Underside Inverted Cyber Rock */}
      <mesh position={[0, -7, 0]}>
        <coneGeometry args={[58, 14, 40]} />
        <meshStandardMaterial color="#020617" roughness={0.9} flatShading />
      </mesh>

      {/* Scenery */}
      <CyberFlora />
    </group>
  );
};
