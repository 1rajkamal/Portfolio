import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CylinderCollider, CuboidCollider } from '@react-three/rapier';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { worldStore } from '../../context/World3DState';
import { SOUNDS } from '../../utils/soundEffects';

// Check if collider belongs to player
function isPlayerCollider(collider: { rigidBody?: { userData?: { tag?: string } } }) {
  return collider?.rigidBody?.userData?.tag === 'player';
}

// 1. Neon Launch Jump Pad
const LaunchPad: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const padMeshRef = useRef<THREE.Mesh>(null);
  const cooldownRef = useRef(0);

  useFrame((state, delta) => {
    cooldownRef.current = Math.max(0, cooldownRef.current - delta);
    if (padMeshRef.current) {
      const scaleY = cooldownRef.current > 0 ? 1 - 0.5 * cooldownRef.current : 1;
      padMeshRef.current.scale.set(1, scaleY, 1);
      padMeshRef.current.rotation.y = 1.5 * state.clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      {/* Sensor Collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.7, 0]}>
        <CylinderCollider
          args={[0.75, 2.2]}
          sensor
          onIntersectionEnter={({ other }) => {
            if (isPlayerCollider(other) && cooldownRef.current <= 0) {
              worldStore.requestLaunch(22);
              cooldownRef.current = 1.1;
              SOUNDS.pad(worldStore.getState().muted);
            }
          }}
        />
      </RigidBody>

      {/* Visual glowing pad */}
      <mesh ref={padMeshRef} position={[0, 0.18, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2.2, 0.36, 8]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.9} roughness={0.25} metalness={0.3} flatShading />
      </mesh>

      {/* Holographic up-beam */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[1.5, 0.5, 6, 12, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
};

// 2. Collectible Data Orb
const CollectibleOrb: React.FC<{ index: number; position: [number, number, number] }> = ({ index, position }) => {
  const orbRef = useRef<THREE.Group>(null);
  const collectedRef = useRef(false);

  useFrame((state, delta) => {
    if (!orbRef.current) return;
    const isCollected = worldStore.getState().orbs.includes(index);

    if (isCollected) {
      orbRef.current.scale.multiplyScalar(1 - Math.min(1, 6 * delta));
      orbRef.current.visible = orbRef.current.scale.x > 0.02;
      return;
    }

    orbRef.current.rotation.y += 1.6 * delta;
    orbRef.current.position.y = position[1] + 0.35 * Math.sin(1.8 * state.clock.elapsedTime + index);
  });

  return (
    <group position={position}>
      {/* Sensor trigger */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider
          args={[1.9, 1.5]}
          sensor
          onIntersectionEnter={({ other }) => {
            if (isPlayerCollider(other) && !collectedRef.current) {
              collectedRef.current = true;
              worldStore.collectOrb(index);
              SOUNDS.orb(worldStore.getState().muted);
            }
          }}
        />
      </RigidBody>

      {/* Visual spinning glowing orb */}
      <group ref={orbRef}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.6} roughness={0.1} metalness={0.4} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.05, 8, 28]} />
          <meshBasicMaterial color="#a5f3fc" transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

// 3. Destructible physics pyramid blocks
const PhysicsPyramid: React.FC<{ at: [number, number]; hue: number }> = ({ at, hue }) => {
  const blocks = useMemo(() => {
    const list: Array<{ position: [number, number, number]; color: string }> = [];
    let count = 0;
    for (let row = 0; row < 3; row++) {
      const itemsInRow = 3 - row;
      for (let col = 0; col < itemsInRow; col++) {
        list.push({
          position: [at[0] + (col - (itemsInRow - 1) / 2) * 0.92, 0.45 + 0.9 * row, at[1]],
          color: `hsl(${(hue + 24 * count) % 360} 80% 60%)`
        });
        count++;
      }
    }
    return list;
  }, [at, hue]);

  return (
    <>
      {blocks.map((b, i) => (
        <RigidBody key={i} position={b.position} colliders={false} mass={0.28} restitution={0.35} friction={0.7} userData={{ tag: 'prop' }}>
          <CuboidCollider args={[0.425, 0.425, 0.425]} />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.85, 0.85]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.35} roughness={0.3} metalness={0.2} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
};

export const WorldProps: React.FC = () => {
  const { launchPadLocations, dataOrbLocations, pyramidPropLocations } = PORTFOLIO_DATA.world3d;

  return (
    <>
      {launchPadLocations.map((pos, i) => (
        <LaunchPad key={`pad-${i}`} position={pos} />
      ))}
      {dataOrbLocations.map((pos, i) => (
        <CollectibleOrb key={`orb-${i}`} index={i} position={pos} />
      ))}
      {pyramidPropLocations.map((prop, i) => (
        <PhysicsPyramid key={`pyr-${i}`} at={prop.at} hue={prop.hue} />
      ))}
    </>
  );
};
