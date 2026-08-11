import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';

const sunDir = new THREE.Vector3(-0.78, 0.32, 0.54).normalize();
const sunPos: [number, number, number] = [130 * sunDir.x, 130 * sunDir.y, 130 * sunDir.z];

function createCyberGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 245, 255, 1.0)');
    grad.addColorStop(0.2, 'rgba(168, 85, 247, 0.7)');
    grad.addColorStop(0.5, 'rgba(255, 0, 127, 0.25)');
    grad.addColorStop(1, 'rgba(255, 0, 127, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Atmosphere: React.FC = () => {
  const uniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Color('#030712') },
      uMid: { value: new THREE.Color('#1e1b4b') },
      uHorizon: { value: new THREE.Color('#701a75') },
      uGround: { value: new THREE.Color('#02040a') },
      uSunDir: { value: sunDir.clone() },
      uSunTint: { value: new THREE.Color('#00f5ff') },
    }),
    []
  );

  const sunTexture = useMemo(() => createCyberGlowTexture(), []);

  return (
    <>
      {/* Cyber Aurora Sky Dome */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[300, 32, 24]} />
        <shaderMaterial
          vertexShader={`
            varying vec3 vWorld;
            void main() {
              vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uZenith;
            uniform vec3 uMid;
            uniform vec3 uHorizon;
            uniform vec3 uGround;
            uniform vec3 uSunDir;
            uniform vec3 uSunTint;
            varying vec3 vWorld;

            void main() {
              vec3 dir = normalize(vWorld);
              float h = dir.y;
              vec3 col = mix(uMid, uZenith, pow(clamp(h, 0.0, 1.0), 0.4));
              col = mix(uHorizon, col, smoothstep(0.0, 0.38, h));
              col = mix(uGround, col, smoothstep(-0.15, 0.01, h));

              float sun = max(dot(dir, normalize(uSunDir)), 0.0);
              col += uSunTint * pow(sun, 16.0) * 0.75;
              col += vec3(0.9, 0.1, 0.6) * pow(sun, 4.0) * 0.12;

              gl_FragColor = vec4(col, 1.0);
            }
          `}
          uniforms={uniforms}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Cyber Pulse Sun Core */}
      <Billboard position={[240 * sunDir.x, 240 * sunDir.y, 240 * sunDir.z]}>
        <mesh>
          <planeGeometry args={[80, 80]} />
          <meshBasicMaterial
            map={sunTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      {/* Dynamic Cyber Lighting */}
      <hemisphereLight intensity={1.2} color="#00f5ff" groundColor="#0f172a" />
      <ambientLight intensity={0.55} color="#c084fc" />
      <directionalLight
        position={sunPos}
        intensity={2.6}
        color="#00f5ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[-60, 40, 70]} intensity={0.8} color="#ec4899" />
    </>
  );
};
