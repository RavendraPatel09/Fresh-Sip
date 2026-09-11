'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SplashProps {
  color?: string;
  progress?: number;
}

export function LiquidSplash({ color = '#FF9F1C', progress = 0.5 }: SplashProps) {
  const splashGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (splashGroup.current) {
      splashGroup.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const splashScale = Math.max(0.1, progress * 1.5);
  const opacity = Math.min(0.85, progress * 1.2);

  return (
    <group ref={splashGroup} position={[0, -0.8, 0]} scale={[splashScale, splashScale, splashScale]}>
      {/* Crown Splash Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.4, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.1}
          metalness={0.1}
          transmission={0.4}
          transparent
          opacity={opacity * 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Radiant Droplet Tendrils */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const dist = 1.2 + (idx % 2 === 0 ? 0.3 : 0);
        return (
          <mesh key={idx} position={[Math.cos(rad) * dist, 0.3, Math.sin(rad) * dist]}>
            <sphereGeometry args={[0.08 + (idx % 3) * 0.03, 16, 16]} />
            <meshPhysicalMaterial color={color} roughness={0.1} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
}
