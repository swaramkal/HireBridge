import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
  position,
  color,
  speed,
  distort,
  scale,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.4;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function TorusRing({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={1.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 60]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.05} transparent opacity={0.7} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const geoRef = useRef<THREE.BufferGeometry>(null);
  useFrame((state) => {
    if (!geoRef.current) return;
    const pos = geoRef.current.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.setY(i, (pos.getY(i) + 0.005) % 6);
    }
    pos.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#93c5fd" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, 3, 2]} intensity={1.5} color="#6366f1" />
      <pointLight position={[5, -3, 2]} intensity={1.2} color="#3b82f6" />
      <pointLight position={[0, 5, -3]} intensity={0.8} color="#a78bfa" />

      <Stars radius={60} depth={30} count={600} factor={3} saturation={0} fade speed={0.5} />
      <Particles />

      <FloatingShape position={[3.5, 1.2, -1]} color="#6366f1" speed={1.2} distort={0.4} scale={1.1} />
      <FloatingShape position={[-3.8, -0.8, -2]} color="#3b82f6" speed={0.9} distort={0.3} scale={0.8} />
      <FloatingShape position={[2.2, -2.2, 0]} color="#8b5cf6" speed={1.5} distort={0.5} scale={0.65} />
      <FloatingShape position={[-2, 2.5, -1]} color="#60a5fa" speed={1.1} distort={0.35} scale={0.5} />

      <TorusRing position={[4.5, -1.5, -3]} color="#818cf8" scale={0.9} />
      <TorusRing position={[-4, 2, -2]} color="#7c3aed" scale={0.6} />
    </Canvas>
  );
}
