'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BottleProps {
  color?: string;
  rotationY?: number;
  scale?: number;
  showCondensation?: boolean;
}

export function ProceduralBottle({
  color = '#FF9F1C',
  rotationY = 0,
  scale = 1,
  showCondensation = true,
}: BottleProps) {
  const bottleGroup = useRef<THREE.Group>(null);
  const liquidMesh = useRef<THREE.Mesh>(null);

  // Animate subtle liquid surface motion
  useFrame((state) => {
    if (bottleGroup.current) {
      bottleGroup.current.rotation.y = rotationY + state.clock.elapsedTime * 0.15;
    }
    if (liquidMesh.current) {
      liquidMesh.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 - 0.05;
    }
  });

  // Condensation droplet positions on bottle surface
  const droplets = useMemo(() => {
    const coords: [number, number, number, number][] = [];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.76;
      const y = (Math.random() - 0.5) * 2.2;
      const scale = Math.random() * 0.04 + 0.015;
      coords.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius, scale]);
    }
    return coords;
  }, []);

  return (
    <group ref={bottleGroup} scale={[scale, scale, scale]}>
      {/* OUTER GLASS BOTTLE */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 2.6, 32]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.92}
          thickness={0.5}
          ior={1.48}
          transparent={true}
          opacity={0.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#FFFFFF"
        />
      </mesh>

      {/* BOTTLE SHOULDERS & NECK */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.35, 0.75, 0.6, 32]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.92}
          thickness={0.5}
          ior={1.48}
          transparent={true}
          opacity={0.7}
          clearcoat={1}
          color="#FFFFFF"
        />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.92}
          thickness={0.5}
          ior={1.48}
          transparent={true}
          opacity={0.7}
          color="#FFFFFF"
        />
      </mesh>

      {/* MATTE WOOD/GOLD CAP */}
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 32]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.05, 32]} />
        <meshStandardMaterial color="#FFB703" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* INNER JUICE LIQUID */}
      <mesh ref={liquidMesh} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.71, 0.71, 2.45, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.25}
          metalness={0.05}
          transmission={0.35}
          thickness={1.2}
          ior={1.33}
          clearcoat={0.8}
        />
      </mesh>

      {/* BRAND LABEL SLEEVE */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.76, 0.76, 1.1, 32, 1, true]} />
        <meshStandardMaterial
          color="#FFFDF8"
          roughness={0.2}
          transparent={true}
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* CONDENSATION DROPLETS */}
      {showCondensation &&
        droplets.map(([x, y, z, r], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[r, 12, 12]} />
            <meshPhysicalMaterial
              transmission={0.95}
              roughness={0.05}
              ior={1.33}
              color="#FFFFFF"
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
    </group>
  );
}
