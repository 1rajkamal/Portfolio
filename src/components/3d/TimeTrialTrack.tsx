import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { worldStore, useWorldStore, PLAYER_TELEMETRY } from '../../context/World3DState';

export interface CheckpointRingData {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

export const CHECKPOINTS: CheckpointRingData[] = [
  { id: 0, position: [12, 2.4, 14], rotation: [0, 0.4, 0], color: '#00f5ff' },
  { id: 1, position: [32, 2.6, -8], rotation: [0, -0.6, 0], color: '#ec4899' },
  { id: 2, position: [8, 2.6, -32], rotation: [0, -1.8, 0], color: '#a855f7' },
  { id: 3, position: [-26, 2.4, -16], rotation: [0, -2.4, 0], color: '#38bdf8' },
  { id: 4, position: [-28, 2.5, 20], rotation: [0, 1.2, 0], color: '#f59e0b' },
  { id: 5, position: [0, 2.4, 6], rotation: [0, 0, 0], color: '#10b981' }
];

const CheckpointRing: React.FC<{
  checkpoint: CheckpointRingData;
  isActiveTarget: boolean;
  isPassed: boolean;
}> = ({ checkpoint, isActiveTarget, isPassed }) => {
  const ringRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current && isActiveTarget) {
      ringRef.current.rotation.z += delta * 1.5;
    }
    if (pulseRef.current && isActiveTarget) {
      const s = 1 + 0.15 * Math.sin(state.clock.elapsedTime * 6);
      pulseRef.current.scale.set(s, s, s);
    }
  });

  const opacity = isActiveTarget ? 0.95 : isPassed ? 0.2 : 0.4;
  const color = isActiveTarget ? '#00f5ff' : isPassed ? '#10b981' : checkpoint.color;

  return (
    <group position={checkpoint.position} rotation={checkpoint.rotation}>
      {/* Outer Rotating Neon Torus */}
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[3.2, 0.12, 16, 32]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>

        {/* Outer Ring Segment Brackets */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh key={i} position={[3.2 * Math.cos(angle), 3.2 * Math.sin(angle), 0]}>
            <boxGeometry args={[0.3, 0.3, 0.4]} />
            <meshStandardMaterial color="#020617" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Inner Glowing Hologram Ring */}
      <mesh ref={pulseRef}>
        <torusGeometry args={[2.9, 0.06, 12, 24]} />
        <meshBasicMaterial
          color={isActiveTarget ? '#ec4899' : color}
          transparent
          opacity={isActiveTarget ? 0.8 : 0.25}
          toneMapped={false}
        />
      </mesh>

      {/* Vertical Laser Beacons when active */}
      {isActiveTarget && (
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 8, 8]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} toneMapped={false} />
        </mesh>
      )}

      {/* Checkpoint Number Label */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text
          position={[0, 4.2, 0]}
          fontSize={1.1}
          color={isActiveTarget ? '#ffffff' : '#94a3b8'}
          font="https://fonts.gstatic.com/s/outfit/v11/Q_ZUr0349p1a_X-A1fX.woff"
          anchorX="center"
          anchorY="middle"
        >
          {checkpoint.id === 5 ? '🏁 FINISH' : `RING #${checkpoint.id + 1}`}
        </Text>
      </Float>

      {/* Ground Energy Projector */}
      <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 24]} />
        <meshBasicMaterial color={color} transparent opacity={isActiveTarget ? 0.3 : 0.08} toneMapped={false} />
      </mesh>
    </group>
  );
};

export const TimeTrialTrack: React.FC = () => {
  const timeTrial = useWorldStore(s => s.timeTrial);

  useFrame(() => {
    if (!timeTrial.active || timeTrial.finished) return;

    const currentTarget = CHECKPOINTS[timeTrial.currentRing];
    if (!currentTarget) return;

    const dist = Math.hypot(
      PLAYER_TELEMETRY.x - currentTarget.position[0],
      PLAYER_TELEMETRY.z - currentTarget.position[2]
    );

    // Rover passed through ring
    if (dist < 4.8 && Math.abs(PLAYER_TELEMETRY.y - currentTarget.position[1]) < 4.0) {
      worldStore.passCheckpoint(timeTrial.currentRing);
    }
  });

  return (
    <group name="time-trial-track">
      {CHECKPOINTS.map(cp => (
        <CheckpointRing
          key={cp.id}
          checkpoint={cp}
          isActiveTarget={timeTrial.active && !timeTrial.finished && timeTrial.currentRing === cp.id}
          isPassed={timeTrial.active && timeTrial.currentRing > cp.id}
        />
      ))}
    </group>
  );
};
