'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FruitProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  speed?: number;
}

export function Mango({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.008 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 * speed) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Mango Body */}
      <mesh scale={[0.8, 1.2, 0.6]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#FF9F1C" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.85, 0]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.03, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#38B000" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Orange({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.006 * speed;
      meshRef.current.rotation.z += 0.007 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 * speed + 1) * 0.12;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Orange Sphere */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color="#FF70A6" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.15, 0.65, 0]} rotation={[0.4, 0.3, -0.2]}>
        <coneGeometry args={[0.12, 0.35, 16]} />
        <meshStandardMaterial color="#52A447" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function Strawberry({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.3 * speed + 2) * 0.14;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Strawberry Body */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]} scale={[0.8, 1.1, 0.8]}>
        <coneGeometry args={[0.5, 0.9, 24]} />
        <meshStandardMaterial color="#FF4D6D" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Leaf Calyx Cap */}
      <group position={[0, 0.35, 0]}>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, idx) => (
          <mesh key={idx} rotation={[0.3, angle, 0]} position={[0, 0, 0]}>
            <coneGeometry args={[0.08, 0.25, 8]} />
            <meshStandardMaterial color="#38B000" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Lemon({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.008 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.1 * speed + 0.5) * 0.16;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Lemon Body */}
      <mesh scale={[0.65, 0.95, 0.65]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#FFC83D" roughness={0.35} metalness={0.05} />
      </mesh>
    </group>
  );
}

export function WatermelonSlice({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.006 * speed;
      meshRef.current.rotation.y += 0.004 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4 * speed) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Red Pulp */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#FF4D6D" roughness={0.3} />
      </mesh>
      {/* Outer Rind */}
      <mesh rotation={[0, 0, 0]} scale={[1.08, 1.08, 1.05]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#2D6A4F" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function MintLeaf({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.012 * speed;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.6 * speed) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 12]} />
        <meshStandardMaterial color="#52A447" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function IceCube({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.007 * speed;
      meshRef.current.rotation.y += 0.009 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 * speed + 3) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
      <meshPhysicalMaterial
        transmission={0.95}
        roughness={0.05}
        ior={1.31}
        thickness={0.4}
        color="#E0F7FA"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
