import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CylinderCollider, CuboidCollider } from '@react-three/rapier';
import { Html, RoundedBox } from '@react-three/drei';
import { PORTFOLIO_DATA, Project } from '../../data/portfolioData';
import { worldStore, useWorldStore, navigateToSection } from '../../context/World3DState';

const ZONES = PORTFOLIO_DATA.world3d.zones;
const zoneMap = Object.fromEntries(ZONES.map(z => [z.id, z]));

// Helper to create 2D canvas textures for 3D props
function createTextTexture(label: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark cyber background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 256, 256);

    // Neon Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 236, 236);

    // Glowing Pill
    ctx.fillStyle = `${color}22`;
    ctx.fillRect(20, 85, 216, 86);

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let fontSize = 34;
    ctx.font = `900 ${fontSize}px sans-serif`;
    while (ctx.measureText(label).width > 190 && fontSize > 16) {
      fontSize -= 2;
      ctx.font = `900 ${fontSize}px sans-serif`;
    }
    ctx.fillText(label, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 3D Kiosk Screen Canvas Texture for Projects
function createProjectKioskTexture(project: Project, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 460;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Cyber background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 820);
    bgGrad.addColorStop(0, '#030712');
    bgGrad.addColorStop(1, '#0b0f19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 460, 820);

    // Glowing Header Bar
    const headGrad = ctx.createLinearGradient(0, 0, 460, 200);
    headGrad.addColorStop(0, accent);
    headGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = headGrad;
    ctx.fillRect(0, 0, 460, 200);

    // Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px sans-serif';
    ctx.fillText(project.title.slice(0, 22), 24, 100);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '600 18px sans-serif';
    ctx.fillText(project.subtitle.slice(0, 36), 24, 140);

    // Tags
    let tagX = 24;
    ctx.font = '700 16px sans-serif';
    for (const tag of project.tags.slice(0, 3)) {
      const w = ctx.measureText(tag).width + 20;
      if (tagX + w > 436) break;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(tagX, 160, w, 28);
      ctx.fillStyle = '#00f5ff';
      ctx.fillText(tag, tagX + 10, 180);
      tagX += w + 8;
    }

    // Body Card preview
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(24, 230, 412, 440);
    ctx.fillStyle = accent;
    ctx.fillRect(36, 245, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('Project Highlights & Architecture', 56, 256);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '400 16px sans-serif';
    const words = project.description.split(' ');
    let line = '';
    let y = 300;
    for (const w of words) {
      if (ctx.measureText(line + w).width > 380) {
        ctx.fillText(line, 40, y);
        line = w + ' ';
        y += 26;
      } else {
        line += w + ' ';
      }
    }
    if (line) ctx.fillText(line, 40, y);

    // Action Button
    ctx.fillStyle = accent;
    ctx.fillRect(24, 710, 412, 65);
    ctx.fillStyle = '#030712';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OPEN PROJECT', 230, 752);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 3D Billboard Landmark Marker Tag
const ZoneMarker: React.FC<{ zone: (typeof ZONES)[0]; yOffset?: number }> = ({ zone, yOffset = 7 }) => {
  return (
    <Html position={[0, yOffset, 0]} center distanceFactor={24} zIndexRange={[10, 0]}>
      <div className="w3d-marker" style={{ '--mk': zone.color } as React.CSSProperties}>
        <span className="w3d-marker-label">{zone.label}</span>
        <span className="w3d-marker-hint">{zone.hint}</span>
      </div>
    </Html>
  );
};

// Pulsing Ground Zone Ring
const ZoneRing: React.FC<{ zone: (typeof ZONES)[0] }> = ({ zone }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const isNear = useWorldStore(s => s.nearZone === zone.id);

  useFrame(state => {
    if (!ringRef.current) return;
    const pulse = 1 + 0.03 * Math.sin(state.clock.elapsedTime * (isNear ? 4 : 1.5));
    ringRef.current.scale.setScalar(pulse);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = isNear ? 0.8 : 0.35;
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <ringGeometry args={[zone.radius - 0.5, zone.radius, 64]} />
      <meshBasicMaterial color={zone.color} transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
};

// 1. Quantum Spire (About)
export const AboutMonument: React.FC = () => {
  const zone = zoneMap.about;
  const coreRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.5 * delta;
      coreRef.current.position.y = 4.8 + 0.3 * Math.sin(1.5 * state.clock.elapsedTime);
    }
  });

  return (
    <group position={zone.position}>
      <ZoneRing zone={zone} />
      <pointLight position={[0, 5, 0]} color={zone.color} intensity={25} distance={22} />
      <ZoneMarker zone={zone} yOffset={9} />

      {/* Cyber Pedestal Base */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.35, 0]}>
        <CylinderCollider args={[0.35, 4.8]} />
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[4.2, 4.8, 0.7, 8]} />
          <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
      </RigidBody>

      {/* Quantum Core */}
      <group ref={coreRef} position={[0, 4.8, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.8} metalness={0.6} roughness={0.1} />
        </mesh>
        {/* Orbiting Quantum Rings */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.4, 0.08, 12, 36]} />
          <meshBasicMaterial color="#a855f7" toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.8, 0.06, 12, 36]} />
          <meshBasicMaterial color="#ff007f" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

// 2. Skills Physics Tower
const PhysicsSkillBlock: React.FC<{ label: string; color: string; position: [number, number, number] }> = ({ label, color, position }) => {
  const texture = useMemo(() => createTextTexture(label, color), [label, color]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <RigidBody
      position={position}
      colliders={false}
      mass={0.45}
      restitution={0.15}
      friction={0.9}
      linearDamping={0.35}
      angularDamping={0.5}
      userData={{ tag: 'prop' }}
    >
      <CuboidCollider args={[0.675, 0.525, 0.675]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.35, 1.05, 1.35]} />
        <meshStandardMaterial map={texture} emissive={color} emissiveIntensity={0.3} roughness={0.2} metalness={0.4} />
      </mesh>
    </RigidBody>
  );
};

export const SkillsTower: React.FC = () => {
  const zone = zoneMap.skills;
  const blocks = PORTFOLIO_DATA.world3d.skillBlocks;

  const blockLayout = useMemo(() => {
    return blocks.map((b, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return {
        ...b,
        position: [
          zone.position[0] + (col - 1) * 1.45 + (row % 2 ? 0.1 : -0.1),
          1.05 + 1.08 * row,
          zone.position[2]
        ] as [number, number, number]
      };
    });
  }, [zone.position, blocks]);

  return (
    <group>
      <group position={zone.position}>
        <ZoneRing zone={zone} />
        <pointLight position={[0, 7, 0]} color={zone.color} intensity={25} distance={22} />
        <ZoneMarker zone={zone} yOffset={9} />
      </group>

      {/* Physics Pedestal */}
      <RigidBody type="fixed" colliders={false} position={[zone.position[0], 0.25, zone.position[2]]}>
        <CylinderCollider args={[0.25, 5.2]} />
        <mesh receiveShadow>
          <cylinderGeometry args={[5, 5.2, 0.5, 10]} />
          <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
      </RigidBody>

      {/* Stack of Destructible Rapier Physics Skill Boxes */}
      {blockLayout.map(b => (
        <PhysicsSkillBlock key={b.label} label={b.label} color={b.color} position={b.position} />
      ))}
    </group>
  );
};

// 3. Projects 3D Curved Gallery
const ProjectKiosk: React.FC<{ project: Project; angle: number; index: number; zone: (typeof ZONES)[0] }> = ({ project, angle, index, zone }) => {
  const x = 9.5 * Math.sin(angle);
  const z = 9.5 * Math.cos(angle);
  const colors = ['#00f5ff', '#a855f7', '#ff007f', '#00ff88', '#f59e0b', '#38bdf8'];
  const accent = colors[index % colors.length];

  const texture = useMemo(() => createProjectKioskTexture(project, accent), [project, accent]);
  const isNear = useWorldStore(s => s.nearZone === zone.id);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <group position={[zone.position[0] + x, 0, zone.position[2] + z]} rotation={[0, angle + Math.PI, 0]}>
      {/* Base Stand */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.25, 0]}>
        <CylinderCollider args={[0.25, 1.1]} />
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 1.1, 0.5, 6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
      </RigidBody>

      {/* Floating 3D Device Screen */}
      <group position={[0, 2.9, 0]} rotation={[-0.08, 0, 0]}>
        <RoundedBox args={[2.3, 4.2, 0.18]} radius={0.16} smoothness={4} castShadow>
          <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[2.04, 3.92]} />
          <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
      </group>

      {/* Interactive Trigger Button */}
      {isNear && (
        <Html position={[0, 1.1, 0.9]} center distanceFactor={22} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={() => navigateToSection('projects')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 pointer-events-auto cursor-pointer border border-white/30"
            style={{ backgroundColor: accent }}
          >
            Launch Project ↗
          </button>
        </Html>
      )}
    </group>
  );
};

export const ProjectsCurvedGallery: React.FC = () => {
  const zone = zoneMap.projects;
  const projects = PORTFOLIO_DATA.projects;
  const span = 1.15 * Math.PI;

  return (
    <group>
      <group position={zone.position}>
        <ZoneRing zone={zone} />
        <pointLight position={[0, 8, 0]} color={zone.color} intensity={28} distance={26} />
        <ZoneMarker zone={zone} yOffset={9} />
      </group>

      {projects.map((proj, i) => {
        const angle = -span / 2 + (span * i) / Math.max(1, projects.length - 1);
        return <ProjectKiosk key={proj.id} project={proj} angle={angle} index={i} zone={zone} />;
      })}
    </group>
  );
};

// 4. Experience & Hackathons Stepping Pillars
export const ExperiencePillars: React.FC = () => {
  const zone = zoneMap.experience;
  const milestones = [
    { label: 'Foundations: C++, Java & Python', height: 1.8 },
    { label: 'Data Science, EDA & Statistical Insights', height: 2.8 },
    { label: '8+ Global Industry Certifications', height: 3.8 },
    { label: 'National Hackathons & Innovation Challenges', height: 4.8 },
    { label: 'Conversational Chatbots & Web Platforms', height: 5.8 }
  ];

  return (
    <group position={zone.position}>
      <ZoneRing zone={zone} />
      <pointLight position={[0, 6, 0]} color={zone.color} intensity={24} distance={22} />
      <ZoneMarker zone={zone} yOffset={9.2} />

      {/* Central Hub */}
      <RigidBody type="fixed" colliders={false} position={[0, 1.4, 0]}>
        <CylinderCollider args={[1.4, 1.8]} />
        <mesh castShadow>
          <cylinderGeometry args={[1.4, 1.8, 2.8, 6]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} metalness={0.7} />
        </mesh>
      </RigidBody>

      {/* Ascending Stepping Pillars */}
      {milestones.map((m, i) => {
        const angle = (i / milestones.length) * Math.PI * 1.7 - 0.85 * Math.PI;
        const x = 8.5 * Math.sin(angle);
        const z = 8.5 * Math.cos(angle);
        return (
          <RigidBody key={i} type="fixed" colliders={false} position={[x, m.height / 2, z]}>
            <CuboidCollider args={[0.75, m.height / 2, 0.75]} />
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.5, m.height, 1.5]} />
              <meshStandardMaterial color="#022c22" emissive="#00ff88" emissiveIntensity={0.2 + 0.08 * i} roughness={0.3} metalness={0.6} />
            </mesh>
          </RigidBody>
        );
      })}
    </group>
  );
};

// 5. Contact Gate / Stargate Portal
export const ContactPortal: React.FC = () => {
  const zone = zoneMap.contact;
  const ringRef = useRef<THREE.Mesh>(null);
  const portalFieldRef = useRef<THREE.Mesh>(null);
  const isNear = useWorldStore(s => s.nearZone === zone.id);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.6 * delta;
    }
    if (portalFieldRef.current) {
      (portalFieldRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.2 * Math.sin(2.5 * state.clock.elapsedTime);
    }
  });

  return (
    <group position={zone.position}>
      <ZoneRing zone={zone} />
      <pointLight position={[0, 4.5, 0]} color={zone.color} intensity={30} distance={24} />
      <ZoneMarker zone={zone} yOffset={9} />

      {/* Pedestal base */}
      <RigidBody type="fixed" colliders={false} position={[0, 0.3, 0]}>
        <CylinderCollider args={[0.3, 4.8]} />
        <mesh receiveShadow>
          <cylinderGeometry args={[4.4, 4.8, 0.6, 8]} />
          <meshStandardMaterial color="#0b0f19" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
      </RigidBody>

      {/* Spinning Stargate Torus */}
      <group position={[0, 4.4, 0]}>
        <mesh ref={ringRef} castShadow>
          <torusGeometry args={[3, 0.35, 12, 40]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1.4} metalness={0.8} roughness={0.1} toneMapped={false} />
        </mesh>

        {/* Shimmering Energy Vortex */}
        <mesh ref={portalFieldRef}>
          <circleGeometry args={[2.9, 40]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {isNear && (
          <Html center zIndexRange={[10, 0]}>
            <div className="bg-slate-950/95 backdrop-blur-2xl p-5 rounded-2xl border border-amber-400 text-center shadow-2xl flex flex-col gap-2.5 min-w-[220px] pointer-events-auto">
              <span className="text-amber-400 font-black text-sm tracking-wide uppercase">Hyperdrive Gate</span>
              <p className="text-xs text-slate-300">Direct transmission to Raj Kamal</p>

              <a
                href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                className="text-xs text-amber-300 hover:text-white font-bold underline"
              >
                {PORTFOLIO_DATA.personal.email}
              </a>

              <div className="flex items-center justify-center gap-2 mt-1">
                <a
                  href={PORTFOLIO_DATA.personal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs font-bold transition-all"
                >
                  GitHub
                </a>
                <a
                  href={PORTFOLIO_DATA.personal.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs font-bold transition-all"
                >
                  LinkedIn
                </a>
              </div>

              <button
                type="button"
                onClick={() => navigateToSection('contact')}
                className="btn-cyber text-xs py-2 px-4 justify-center mt-1 cursor-pointer"
              >
                Open Transmission Form ↗
              </button>
            </div>
          </Html>
        )}
      </group>

      {/* Support Pillars */}
      {[-2.4, 2.4].map((xOffset, i) => (
        <mesh key={i} position={[xOffset, 2, 0]} castShadow>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
      ))}
    </group>
  );
};

export const WorldLandmarks: React.FC = () => {
  return (
    <>
      <AboutMonument />
      <SkillsTower />
      <ProjectsCurvedGallery />
      <ExperiencePillars />
      <ContactPortal />
    </>
  );
};
