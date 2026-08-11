import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';
import { useWorldStore, WeatherMode } from '../../context/World3DState';

const sunDir = new THREE.Vector3(-0.78, 0.32, 0.54).normalize();
const sunPos: [number, number, number] = [130 * sunDir.x, 130 * sunDir.y, 130 * sunDir.z];

const WEATHER_PALETTES: Record<
  WeatherMode,
  {
    zenith: string;
    mid: string;
    horizon: string;
    ground: string;
    sunTint: string;
    hemiColor: string;
    groundColor: string;
    ambientColor: string;
    sunLightColor: string;
    accentLightColor: string;
    sunGlowStops: [number, string][];
  }
> = {
  midnight: {
    zenith: '#030712',
    mid: '#1e1b4b',
    horizon: '#701a75',
    ground: '#02040a',
    sunTint: '#00f5ff',
    hemiColor: '#00f5ff',
    groundColor: '#0f172a',
    ambientColor: '#c084fc',
    sunLightColor: '#00f5ff',
    accentLightColor: '#ec4899',
    sunGlowStops: [
      [0, 'rgba(0, 245, 255, 1.0)'],
      [0.2, 'rgba(168, 85, 247, 0.7)'],
      [0.5, 'rgba(255, 0, 127, 0.25)'],
      [1, 'rgba(255, 0, 127, 0)']
    ]
  },
  sunset: {
    zenith: '#1c1917',
    mid: '#7c2d12',
    horizon: '#ea580c',
    ground: '#0c0a09',
    sunTint: '#fbbf24',
    hemiColor: '#f59e0b',
    groundColor: '#451a03',
    ambientColor: '#fb7185',
    sunLightColor: '#fbbf24',
    accentLightColor: '#ef4444',
    sunGlowStops: [
      [0, 'rgba(251, 191, 36, 1.0)'],
      [0.25, 'rgba(234, 88, 12, 0.75)'],
      [0.55, 'rgba(225, 29, 72, 0.3)'],
      [1, 'rgba(225, 29, 72, 0)']
    ]
  },
  matrix: {
    zenith: '#022c22',
    mid: '#064e3b',
    horizon: '#059669',
    ground: '#021a13',
    sunTint: '#34d399',
    hemiColor: '#10b981',
    groundColor: '#064e3b',
    ambientColor: '#6ee7b7',
    sunLightColor: '#34d399',
    accentLightColor: '#10b981',
    sunGlowStops: [
      [0, 'rgba(52, 211, 153, 1.0)'],
      [0.25, 'rgba(16, 185, 129, 0.7)'],
      [0.55, 'rgba(4, 120, 87, 0.25)'],
      [1, 'rgba(4, 120, 87, 0)']
    ]
  }
};

function createGlowTexture(stops: [number, string][]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Atmosphere: React.FC = () => {
  const weatherMode = useWorldStore(s => s.weatherMode);
  const palette = WEATHER_PALETTES[weatherMode] || WEATHER_PALETTES.midnight;

  const uniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Color(palette.zenith) },
      uMid: { value: new THREE.Color(palette.mid) },
      uHorizon: { value: new THREE.Color(palette.horizon) },
      uGround: { value: new THREE.Color(palette.ground) },
      uSunDir: { value: sunDir.clone() },
      uSunTint: { value: new THREE.Color(palette.sunTint) }
    }),
    []
  );

  useEffect(() => {
    uniforms.uZenith.value.set(palette.zenith);
    uniforms.uMid.value.set(palette.mid);
    uniforms.uHorizon.value.set(palette.horizon);
    uniforms.uGround.value.set(palette.ground);
    uniforms.uSunTint.value.set(palette.sunTint);
  }, [weatherMode, palette, uniforms]);

  const sunTexture = useMemo(() => createGlowTexture(palette.sunGlowStops), [palette]);

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
      <hemisphereLight intensity={1.2} color={palette.hemiColor} groundColor={palette.groundColor} />
      <ambientLight intensity={0.55} color={palette.ambientColor} />
      <directionalLight
        position={sunPos}
        intensity={2.6}
        color={palette.sunLightColor}
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
      <directionalLight position={[-60, 40, 70]} intensity={0.8} color={palette.accentLightColor} />
    </>
  );
};
