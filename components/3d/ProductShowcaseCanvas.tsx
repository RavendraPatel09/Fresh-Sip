'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralBottle } from './ProceduralBottle';
import { Mango, Orange, Strawberry, Lemon, WatermelonSlice, MintLeaf, IceCube } from './ProceduralFruits';
import { SAMPLE_PRODUCTS } from '@/lib/productsData';

interface ProductShowcaseCanvasProps {
  color?: string;
  fruitType?: 'mango' | 'orange' | 'strawberry' | 'lemon' | 'watermelon' | 'green' | 'berry' | 'pineapple';
  enableOrbit?: boolean;
}

function ShowcaseScene({ color = '#FF9F1C', fruitType = 'mango' }: ProductShowcaseCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.25;
    }
  });

  const renderFruit = () => {
    switch (fruitType) {
      case 'orange':
        return <Orange position={[1.4, 0.4, 0.2]} scale={0.85} speed={1.2} />;
      case 'strawberry':
      case 'berry':
        return <Strawberry position={[1.4, 0.4, 0.2]} scale={0.9} speed={1.2} />;
      case 'watermelon':
        return <WatermelonSlice position={[1.4, 0.4, 0.2]} scale={0.8} speed={1.2} />;
      case 'lemon':
      case 'green':
      default:
        return <Lemon position={[1.4, 0.4, 0.2]} scale={0.85} speed={1.2} />;
    }
  };

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <pointLight position={[-3, -1, -2]} intensity={0.5} color={color} />

      <group ref={groupRef} position={[0, -0.4, 0]}>
        <ProceduralBottle color={color} scale={1.1} showCondensation={true} />
        {renderFruit()}
        <MintLeaf position={[-1.3, -0.3, 0.4]} scale={1.1} speed={1.4} />
        <IceCube position={[-1.2, 0.8, -0.2]} scale={1} speed={1.1} />
      </group>

      <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={8} blur={2.5} />
    </>
  );
}

export default function ProductShowcaseCanvas({ color, fruitType, enableOrbit = true }: ProductShowcaseCanvasProps) {
  // When rendering Mango Burst, display the realistic commercial Mango Burst bottle & fresh mangoes photo composition
  if (fruitType === 'mango') {
    return (
      <div className="w-full h-[400px] md:h-[480px] relative flex items-center justify-center p-2 cursor-default select-none">
        <div className="relative w-full h-full max-w-[540px] max-h-[440px] flex items-center justify-center">
          <img
            src={SAMPLE_PRODUCTS[0].image}
            alt="FreshSip Mango Burst Realistic Bottle and Mangoes"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(234,88,12,0.18)] cursor-default select-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] md:h-[450px] relative">
      <Canvas camera={{ position: [0, 0.2, 4.5], fov: 45 }}>
        <Suspense fallback={null}>
          <ShowcaseScene color={color} fruitType={fruitType} />
          {enableOrbit && <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 3} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
