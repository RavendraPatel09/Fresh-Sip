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

// 1. MANGO & MANGO SLICE
export function Mango({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.y += 0.008 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 * speed) * 0.12;
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

export function MangoSlice({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.006 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4 * speed + 1) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh scale={[0.8, 0.3, 0.5]} rotation={[0.3, 0.5, 0]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color="#FFC83D" roughness={0.25} />
      </mesh>
    </group>
  );
}

// 2. ORANGE & ORANGE SLICE
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
        <meshStandardMaterial color="#FF6B00" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0.15, 0.65, 0]} rotation={[0.4, 0.3, -0.2]}>
        <coneGeometry args={[0.12, 0.35, 16]} />
        <meshStandardMaterial color="#52A447" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function OrangeSlice({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.3 * speed + 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#FF70A6" roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.06, 1.06, 1.02]}>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#FFF3E0" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3. PINEAPPLE & PINEAPPLE RING
export function Pineapple({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.007 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.1 * speed) * 0.11;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Pineapple Oval Body */}
      <mesh scale={[0.7, 1.1, 0.7]}>
        <cylinderGeometry args={[0.5, 0.6, 1.1, 16]} />
        <meshStandardMaterial color="#D4A373" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Crown Leaves */}
      <group position={[0, 0.7, 0]}>
        {[0, 1.2, 2.4, 3.6, 4.8].map((angle, idx) => (
          <mesh key={idx} rotation={[0.4, angle, 0]} position={[0, 0, 0]}>
            <coneGeometry args={[0.1, 0.5, 8]} />
            <meshStandardMaterial color="#2D6A4F" roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function PineappleRing({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.006 * speed;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.4 * speed) * 0.09;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.45, 0.16, 16, 32]} />
        <meshStandardMaterial color="#FFB703" roughness={0.3} />
      </mesh>
    </group>
  );
}

// 4. GREEN APPLE & CUCUMBER
export function GreenApple({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.009 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 * speed + 2) * 0.12;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh scale={[0.8, 0.75, 0.8]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color="#70E000" roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.25, 8]} />
        <meshStandardMaterial color="#381D2A" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function CucumberSlice({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.008 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 * speed) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 24]} />
        <meshStandardMaterial color="#AACC00" roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]} scale={[1.05, 1.05, 1.01]}>
        <cylinderGeometry args={[0.45, 0.45, 0.06, 24]} />
        <meshStandardMaterial color="#38B000" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 5. STRAWBERRY & BERRY
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

export function Blueberry({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.6 * speed + 1) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.25, 24, 24]} />
      <meshStandardMaterial color="#3A0CA3" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

// 6. BANANA SLICE & GINGER / LIME
export function BananaSlice({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.007 * speed;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.2 * speed + 3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 16]} />
        <meshStandardMaterial color="#FFEE93" roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, 0]} scale={[1.06, 1.06, 1.02]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#E9D8A6" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Ginger({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.1 * speed + 1.5) * 0.09;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.18, 0.45, 12, 16]} />
        <meshStandardMaterial color="#C6AC8F" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function Lime({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, speed = 1 }: FruitProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.007 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.3 * speed + 2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#70E000" roughness={0.35} metalness={0.05} />
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
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#FF4D6D" roughness={0.3} />
      </mesh>
      <mesh rotation={[0, 0, 0]} scale={[1.08, 1.08, 1.05]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#2D6A4F" roughness={0.5} />
      </mesh>
    </group>
  );
}
