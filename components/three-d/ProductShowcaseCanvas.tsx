'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralBottle } from './ProceduralBottle';
import {
  Mango,
  MangoSlice,
  Orange,
  OrangeSlice,
  Pineapple,
  PineappleRing,
  GreenApple,
  CucumberSlice,
  Strawberry,
  Blueberry,
  BananaSlice,
  Ginger,
  Lime,
  MintLeaf,
  IceCube,
} from './ProceduralFruits';

interface ProductShowcaseCanvasProps {
  color?: string;
  fruitType?: 'mango' | 'orange' | 'strawberry' | 'lemon' | 'watermelon' | 'green' | 'berry' | 'pineapple';
  enableOrbit?: boolean;
}

function ShowcaseScene({ color = '#FF9F1C', fruitType = 'mango' }: ProductShowcaseCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle idle floating motion that never interferes with OrbitControls
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.4 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  const renderFruitScene = () => {
    switch (fruitType) {
      case 'mango':
        return (
          <>
            <Mango position={[1.4, 0.2, 0.2]} scale={0.9} speed={1.1} />
            <MangoSlice position={[1.1, -0.6, 0.5]} scale={0.85} speed={1.2} />
            <Lime position={[-1.3, -0.5, 0.4]} scale={0.75} speed={1.3} />
            <MintLeaf position={[-1.2, 0.5, 0.3]} scale={1.1} speed={1.4} />
          </>
        );
      case 'orange':
        return (
          <>
            <Orange position={[1.4, 0.3, 0.2]} scale={0.9} speed={1.1} />
            <OrangeSlice position={[1.1, -0.5, 0.5]} scale={0.85} speed={1.2} />
            <Ginger position={[-1.3, -0.5, 0.4]} scale={0.85} speed={1.1} />
            <MintLeaf position={[-1.2, 0.5, 0.3]} scale={1.1} speed={1.4} />
          </>
        );
      case 'pineapple':
        return (
          <>
            <Pineapple position={[1.4, 0.2, 0.1]} scale={0.85} speed={1.1} />
            <PineappleRing position={[1.1, -0.6, 0.5]} scale={0.85} speed={1.2} />
            <MintLeaf position={[-1.3, -0.4, 0.4]} scale={1.1} speed={1.4} />
          </>
        );
      case 'green':
      case 'lemon':
        return (
          <>
            <GreenApple position={[1.3, 0.3, 0.2]} scale={0.85} speed={1.1} />
            <CucumberSlice position={[1.1, -0.5, 0.5]} scale={0.85} speed={1.2} />
            <Lime position={[-1.3, -0.5, 0.4]} scale={0.75} speed={1.3} />
            <MintLeaf position={[-1.2, 0.5, 0.3]} scale={1.1} speed={1.4} />
          </>
        );
      case 'strawberry':
        return (
          <>
            <Strawberry position={[1.3, 0.3, 0.2]} scale={0.9} speed={1.1} />
            <Blueberry position={[1.1, -0.6, 0.5]} scale={1.1} speed={1.3} />
            <MintLeaf position={[-1.3, -0.4, 0.4]} scale={1.1} speed={1.4} />
          </>
        );
      case 'berry':
      default:
        return (
          <>
            <BananaSlice position={[1.3, 0.3, 0.2]} scale={0.9} speed={1.1} />
            <Strawberry position={[1.1, -0.5, 0.5]} scale={0.85} speed={1.2} />
            <Blueberry position={[-1.3, -0.5, 0.4]} scale={1.2} speed={1.3} />
            <MintLeaf position={[-1.2, 0.5, 0.3]} scale={1.1} speed={1.4} />
          </>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow />
      <pointLight position={[-3, -1, -2]} intensity={0.6} color={color} />
      <pointLight position={[3, 2, 2]} intensity={0.4} color="#FFFFFF" />

      <group ref={groupRef} position={[0, -0.4, 0]}>
        <ProceduralBottle color={color} scale={1.1} showCondensation={true} />
        {renderFruitScene()}
        <IceCube position={[-1.1, 0.9, -0.2]} scale={0.9} speed={1.2} />
      </group>

      <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={8} blur={2.5} />
    </>
  );
}

export default function ProductShowcaseCanvas({ color, fruitType, enableOrbit = true }: ProductShowcaseCanvasProps) {
  return (
    <div className="w-full h-[400px] md:h-[480px] relative rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0.2, 4.5], fov: 45 }}>
        <Suspense fallback={null}>
          <ShowcaseScene color={color} fruitType={fruitType} />
          {enableOrbit && (
            <OrbitControls
              enableZoom={true}
              minDistance={2.5}
              maxDistance={7}
              maxPolarAngle={Math.PI / 2 + 0.15}
              minPolarAngle={Math.PI / 3.5}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.8}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
