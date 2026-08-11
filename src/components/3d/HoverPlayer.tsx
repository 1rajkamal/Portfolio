import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import { RoundedBox } from '@react-three/drei';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { worldStore, useWorldStore, PLAYER_TELEMETRY, VehicleSkin } from '../../context/World3DState';
import { SOUNDS } from '../../utils/soundEffects';

const SPAWN_POINT = PORTFOLIO_DATA.world3d.spawnPoint;
const ZONES = PORTFOLIO_DATA.world3d.zones;

const camTarget = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const playerPosVec = new THREE.Vector3();

const SKIN_CONFIGS: Record<
  VehicleSkin,
  {
    name: string;
    bodyBase: string;
    bodyHood: string;
    accent: string;
    canopyColor: string;
    wheelRing: string;
    underglow: string;
    jetColor: string;
    tailLight: string;
    headlight: string;
  }
> = {
  'cyber-cyan': {
    name: 'Cyber Cyan Rover',
    bodyBase: '#020617',
    bodyHood: '#0f172a',
    accent: '#00f5ff',
    canopyColor: '#00f5ff',
    wheelRing: '#00f5ff',
    underglow: '#00f5ff',
    jetColor: '#00f5ff',
    tailLight: '#ff007f',
    headlight: '#00f5ff'
  },
  'hyper-pink': {
    name: 'Hyper Pink Speeder',
    bodyBase: '#180816',
    bodyHood: '#2e1065',
    accent: '#ec4899',
    canopyColor: '#f43f5e',
    wheelRing: '#fb7185',
    underglow: '#ec4899',
    jetColor: '#fb7185',
    tailLight: '#00f5ff',
    headlight: '#f43f5e'
  },
  'phantom-gold': {
    name: 'Phantom Gold Interceptor',
    bodyBase: '#1c1917',
    bodyHood: '#292524',
    accent: '#eab308',
    canopyColor: '#10b981',
    wheelRing: '#fbbf24',
    underglow: '#10b981',
    jetColor: '#f59e0b',
    tailLight: '#22c55e',
    headlight: '#fbbf24'
  }
};

// Cyber Hover Car Wheel / Turbine
const HoverWheel: React.FC<{
  position: [number, number, number];
  isFront?: boolean;
  steeringAngle: React.MutableRefObject<number>;
  ringColor: string;
}> = ({ position, isFront, steeringAngle, ringColor }) => {
  const wheelGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (wheelGroupRef.current && isFront) {
      wheelGroupRef.current.rotation.y = steeringAngle.current * 0.7;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += (5 + PLAYER_TELEMETRY.speed * 0.5) * delta;
    }
  });

  return (
    <group ref={wheelGroupRef} position={position}>
      {/* Outer Armor Guard */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.45, 0.7]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glowing Mag-Lev Turbine Wheel */}
      <mesh ref={ringRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.28, 20]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Neon Energy Ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.33, 0.04, 8, 24]} />
        <meshBasicMaterial color={ringColor} toneMapped={false} />
      </mesh>
    </group>
  );
};

export const HoverPlayer: React.FC = () => {
  const vehicleSkin = useWorldStore(s => s.vehicleSkin);
  const skin = SKIN_CONFIGS[vehicleSkin] || SKIN_CONFIGS['cyber-cyan'];

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const carYawRef = useRef<THREE.Group>(null);
  const carBodyRef = useRef<THREE.Group>(null);
  const leftHeadlightRef = useRef<THREE.SpotLight>(null);
  const rightHeadlightRef = useRef<THREE.SpotLight>(null);
  const underglowRef = useRef<THREE.PointLight>(null);
  const leftJetRef = useRef<THREE.Mesh>(null);
  const rightJetRef = useRef<THREE.Mesh>(null);

  // Driving & Dynamics
  const headingRef = useRef(0);
  const steeringAngleRef = useRef(0);
  const airTimerRef = useRef(0);
  const rollRef = useRef(0);
  const pitchRef = useRef(0);
  const lastJumpTickRef = useRef(0);
  const lastRespawnTickRef = useRef(0);
  const lastLaunchTickRef = useRef(0);
  const bumpCooldownRef = useRef(0);
  const stuckTimerRef = useRef(0);
  const cameraInitializedRef = useRef(false);

  // Keyboard input tracking
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        worldStore.requestJump();
      }
      if (e.key.toLowerCase() === 'r') {
        worldStore.requestRespawn();
      }
      if (e.key === 'Escape') {
        worldStore.closePanel();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const dt = Math.min(delta, 1 / 30);
    const store = worldStore.getState();
    const pos = rb.translation();
    const linvel = rb.linvel();
    playerPosVec.set(pos.x, pos.y, pos.z);

    // Orbit camera when game not started
    if (!store.started) {
      const angle = 0.25 * state.clock.elapsedTime;
      camTarget.set(pos.x + 13 * Math.sin(angle), pos.y + 6.5, pos.z + 13 * Math.cos(angle));
      state.camera.position.lerp(camTarget, 1 - Math.exp(-2.5 * dt));
      state.camera.lookAt(playerPosVec.x, playerPosVec.y + 1, playerPosVec.z);
      if (carYawRef.current) {
        carYawRef.current.rotation.y += 0.3 * dt;
      }
      return;
    }

    // Input collection
    const keys = keysRef.current;
    let forward = (keys['w'] || keys['arrowup'] ? 1 : 0) - (keys['s'] || keys['arrowdown'] ? 1 : 0);
    let turn = (keys['a'] || keys['arrowleft'] ? 1 : 0) - (keys['d'] || keys['arrowright'] ? 1 : 0);

    const { joy } = store;
    if (Math.abs(joy.y) > 0.08) forward = -joy.y;
    if (Math.abs(joy.x) > 0.08) turn = -joy.x;

    forward = THREE.MathUtils.clamp(forward, -1, 1);
    turn = THREE.MathUtils.clamp(turn, -1, 1);
    const isBoost = (keys['shift'] || keys['shiftleft'] || keys['shiftright']) && forward > 0;

    // Steering & Heading
    steeringAngleRef.current = THREE.MathUtils.lerp(steeringAngleRef.current, turn, 1 - Math.exp(-10 * dt));
    headingRef.current += 2.6 * turn * dt;

    const sinH = -Math.sin(headingRef.current);
    const cosH = -Math.cos(headingRef.current);
    const maxSpeed = 17 * forward * (isBoost ? 1.85 : 1);
    const accelRate = 1 - Math.exp(-7.5 * dt);

    let vx = linvel.x + (sinH * maxSpeed - linvel.x) * accelRate;
    let vz = linvel.z + (cosH * maxSpeed - linvel.z) * accelRate;
    let vy = linvel.y;

    // Jump Handling
    const isJumpRequested = keys[' '] || store.jumpTick !== lastJumpTickRef.current;
    lastJumpTickRef.current = store.jumpTick;

    if (airTimerRef.current > 0) {
      airTimerRef.current -= dt;
    } else {
      // Hover spring levitation
      const hoverSpring = 0.1 * Math.sin(3 * state.clock.elapsedTime);
      vy = THREE.MathUtils.clamp((1.15 - pos.y) * 7.5 + hoverSpring, -18, 14);
    }

    if (isJumpRequested && airTimerRef.current <= 0 && pos.y < 2.0) {
      vy = 13.5;
      airTimerRef.current = 0.8;
      SOUNDS.jump(store.muted);
    }

    // Launch Pad Trigger
    if (store.launch.tick !== lastLaunchTickRef.current) {
      lastLaunchTickRef.current = store.launch.tick;
      vy = store.launch.power;
      airTimerRef.current = 1.3;
    }

    // Auto-unstuck
    if (Math.abs(forward) > 0.1 && Math.hypot(linvel.x, linvel.z) < 1.5) {
      stuckTimerRef.current += dt;
    } else {
      stuckTimerRef.current = 0;
    }
    if (stuckTimerRef.current > 0.85) {
      vy = 12.5;
      airTimerRef.current = 0.8;
      stuckTimerRef.current = 0;
      SOUNDS.jump(store.muted);
    }

    bumpCooldownRef.current = Math.max(0, bumpCooldownRef.current - dt);

    // Boundary Bounce
    const distFromCenter = Math.hypot(pos.x, pos.z);
    if (distFromCenter > 57) {
      const ratio = 57 / distFromCenter;
      rb.setTranslation({ x: pos.x * ratio, y: pos.y, z: pos.z * ratio }, true);
      vx *= -0.4;
      vz *= -0.4;
      if (bumpCooldownRef.current <= 0) {
        SOUNDS.bump(0.7, store.muted);
        bumpCooldownRef.current = 0.6;
      }
    }

    // Fall or Respawn
    const isRespawnRequested = store.respawnTick !== lastRespawnTickRef.current;
    lastRespawnTickRef.current = store.respawnTick;
    if (pos.y < -12 || isRespawnRequested) {
      rb.setTranslation({ x: SPAWN_POINT[0], y: SPAWN_POINT[1], z: SPAWN_POINT[2] }, true);
      headingRef.current = 0;
      vx = 0;
      vz = 0;
      vy = 0;
      airTimerRef.current = 0;
      stuckTimerRef.current = 0;
    }

    rb.setLinvel({ x: vx, y: vy, z: vz }, true);

    // Sports Car Body Dynamics (Banking, Pitch, Roll)
    const currentSpeed = Math.hypot(vx, vz);
    const speedRatio = Math.min(1, currentSpeed / 28);

    if (carYawRef.current) {
      carYawRef.current.rotation.y = headingRef.current;
    }
    if (carBodyRef.current) {
      rollRef.current += (-0.45 * turn * speedRatio - rollRef.current) * (1 - Math.exp(-7 * dt));
      pitchRef.current += (0.16 * forward - pitchRef.current) * (1 - Math.exp(-7 * dt));
      carBodyRef.current.rotation.z = rollRef.current;
      carBodyRef.current.rotation.x = pitchRef.current;
    }

    // Dynamic Jet Thrusters & Underglow
    if (underglowRef.current) {
      underglowRef.current.color.set(skin.underglow);
      underglowRef.current.intensity = 8 + 18 * speedRatio + (isBoost ? 12 : 0);
    }
    const jetScaleZ = 0.5 + speedRatio * (isBoost ? 3.0 : 1.8);
    if (leftJetRef.current) leftJetRef.current.scale.set(1, 1, jetScaleZ);
    if (rightJetRef.current) rightJetRef.current.scale.set(1, 1, jetScaleZ);

    // Update Telemetry for HUD
    PLAYER_TELEMETRY.x = pos.x;
    PLAYER_TELEMETRY.y = pos.y;
    PLAYER_TELEMETRY.z = pos.z;
    PLAYER_TELEMETRY.heading = headingRef.current;
    PLAYER_TELEMETRY.speed = currentSpeed;
    PLAYER_TELEMETRY.airborne = airTimerRef.current > 0;

    // Landmark Proximity
    let closestZone: string | null = null;
    let minZoneDist = Infinity;
    for (const zone of ZONES) {
      const dist = Math.hypot(pos.x - zone.position[0], pos.z - zone.position[2]);
      if (dist < zone.radius && dist < minZoneDist) {
        minZoneDist = dist;
        closestZone = zone.id;
      }
    }
    worldStore.setNearZone(closestZone);

    // Dynamic 3rd Person Sports Camera
    const camDist = 10.5 + 4.5 * speedRatio;
    camTarget.set(pos.x - sinH * camDist, pos.y + 4.8 + 0.8 * speedRatio, pos.z - cosH * camDist);
    lookTarget.set(pos.x + 5 * sinH, pos.y + 1.1, pos.z + 5 * cosH);

    if (!cameraInitializedRef.current) {
      state.camera.position.copy(camTarget);
      cameraInitializedRef.current = true;
    }
    state.camera.position.lerp(camTarget, 1 - Math.exp(-5 * dt));
    state.camera.lookAt(lookTarget);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={SPAWN_POINT}
      colliders={false}
      mass={2.5}
      lockRotations
      linearDamping={0.35}
      friction={0.2}
      restitution={0.15}
      userData={{ tag: 'player' }}
      onCollisionEnter={e => {
        const otherData = (e.other.rigidBody?.userData as { tag?: string }) || {};
        if (otherData.tag === 'prop') {
          SOUNDS.bump(1.5, worldStore.getState().muted);
        }
      }}
      ccd
    >
      <CuboidCollider args={[0.95, 0.35, 1.8]} />

      <group ref={carYawRef}>
        <group ref={carBodyRef}>
          {/* ================= MAIN CYBER CAR CHASSIS ================= */}
          {/* Lower aerodynamic base */}
          <RoundedBox args={[1.8, 0.28, 3.4]} radius={0.12} smoothness={4} castShadow>
            <meshStandardMaterial color={skin.bodyBase} metalness={0.9} roughness={0.15} />
          </RoundedBox>

          {/* Upper Sports Hood & Sloped Nose */}
          <mesh position={[0, 0.22, -0.4]} rotation={[-0.14, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.22, 2.0]} />
            <meshStandardMaterial color={skin.bodyHood} metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Front Splitter */}
          <mesh position={[0, -0.08, -1.75]} castShadow>
            <boxGeometry args={[1.9, 0.08, 0.4]} />
            <meshStandardMaterial
              color={skin.accent}
              emissive={skin.accent}
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* ================= COCKPIT CANOPY ================= */}
          <mesh position={[0, 0.45, 0.1]} rotation={[0.08, 0, 0]} castShadow>
            <boxGeometry args={[1.2, 0.35, 1.3]} />
            <meshPhysicalMaterial
              color={skin.canopyColor}
              emissive={skin.canopyColor}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
              roughness={0.1}
              metalness={0.2}
              transmission={0.6}
            />
          </mesh>

          {/* ================= REAR SPOILER / WING ================= */}
          <group position={[0, 0.48, 1.4]}>
            {/* Wing Blade */}
            <mesh castShadow>
              <boxGeometry args={[1.9, 0.08, 0.35]} />
              <meshStandardMaterial color={skin.accent} emissive={skin.accent} emissiveIntensity={0.8} />
            </mesh>
            {/* Struts */}
            {[-0.6, 0.6].map((x, i) => (
              <mesh key={i} position={[x, -0.22, 0]} castShadow>
                <boxGeometry args={[0.08, 0.38, 0.2]} />
                <meshStandardMaterial color={skin.bodyHood} metalness={0.9} />
              </mesh>
            ))}
          </group>

          {/* ================= 4 MAG-LEV HOVER WHEELS ================= */}
          <HoverWheel
            position={[-0.95, -0.1, -1.05]}
            isFront
            steeringAngle={steeringAngleRef}
            ringColor={skin.wheelRing}
          />
          <HoverWheel
            position={[0.95, -0.1, -1.05]}
            isFront
            steeringAngle={steeringAngleRef}
            ringColor={skin.wheelRing}
          />
          <HoverWheel
            position={[-0.98, -0.1, 1.05]}
            steeringAngle={steeringAngleRef}
            ringColor={skin.wheelRing}
          />
          <HoverWheel
            position={[0.98, -0.1, 1.05]}
            steeringAngle={steeringAngleRef}
            ringColor={skin.wheelRing}
          />

          {/* ================= DUAL LED HEADLIGHT BEAMS ================= */}
          {[-0.65, 0.65].map((x, i) => (
            <mesh key={i} position={[x, 0.12, -1.7]}>
              <boxGeometry args={[0.3, 0.08, 0.08]} />
              <meshBasicMaterial color={skin.headlight} toneMapped={false} />
            </mesh>
          ))}
          <spotLight
            ref={leftHeadlightRef}
            position={[-0.65, 0.3, -1.7]}
            target-position={[-0.65, -0.5, -12]}
            color={skin.headlight}
            intensity={12}
            angle={0.6}
            penumbra={0.4}
            distance={28}
          />
          <spotLight
            ref={rightHeadlightRef}
            position={[0.65, 0.3, -1.7]}
            target-position={[0.65, -0.5, -12]}
            color={skin.headlight}
            intensity={12}
            angle={0.6}
            penumbra={0.4}
            distance={28}
          />

          {/* ================= REAR NEON TAILLIGHT BAR ================= */}
          <mesh position={[0, 0.18, 1.72]}>
            <boxGeometry args={[1.65, 0.06, 0.08]} />
            <meshBasicMaterial color={skin.tailLight} toneMapped={false} />
          </mesh>

          {/* ================= TWIN REAR JET THRUSTERS ================= */}
          <group position={[0, 0.05, 1.8]}>
            {[-0.42, 0.42].map((x, i) => (
              <group key={i} position={[x, 0, 0]}>
                {/* Exhaust Nozzle */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.18, 0.22, 0.3, 16]} />
                  <meshStandardMaterial color="#020617" metalness={0.9} />
                </mesh>
                {/* Plasma Jet Flame */}
                <mesh ref={i === 0 ? leftJetRef : rightJetRef} position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.16, 0.9, 16, 1, true]} />
                  <meshBasicMaterial color={skin.jetColor} transparent opacity={0.8} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>

          {/* ================= NEON UNDERGLOW ================= */}
          <pointLight ref={underglowRef} position={[0, -0.4, 0]} color={skin.underglow} intensity={8} distance={10} />
          <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.8, 32]} />
            <meshBasicMaterial color={skin.underglow} transparent opacity={0.35} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
};
