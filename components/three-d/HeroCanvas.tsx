'use client';

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralBottle } from './ProceduralBottle';
import { Mango, Orange, Strawberry, Lemon, WatermelonSlice, MintLeaf, IceCube } from './ProceduralFruits';
import { LiquidSplash } from './LiquidSplash';
import { FloatingParticles } from './FloatingParticles';

interface HeroCanvasProps {
  scrollProgress: number; // 0 to 1
  accentColor?: string;
}

function Hero3DScene({ scrollProgress, accentColor = '#FF9F1C' }: HeroCanvasProps) {
  // Bottle scale starts at 0.85 on initial load (scroll = 0) and smoothly scales up to 1.15
  const bottleScale = 0.85 + scrollProgress * 0.3;
  const bottlePositionY = Math.sin(scrollProgress * Math.PI) * 0.25 - 0.2;
  const bottleRotationY = scrollProgress * Math.PI * 3;

  const fruitRadius = 2.4 - scrollProgress * 0.8;

  useFrame(({ camera }) => {
    camera.position.z = THREE.MathUtils.lerp(5.5, 4.2, Math.min(1, scrollProgress * 1.2));
    camera.position.y = THREE.MathUtils.lerp(0.4, 0.1, scrollProgress);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color={accentColor} />

      {/* Floating 3D Particle Field */}
      <FloatingParticles count={120} />

      {/* Center Hero Bottle - Always Visible */}
      <group position={[0, bottlePositionY, 0]}>
        <ProceduralBottle
          color={accentColor}
          scale={bottleScale}
          rotationY={bottleRotationY}
          showCondensation={true}
        />
        {scrollProgress > 0.3 && (
          <LiquidSplash color={accentColor} progress={(scrollProgress - 0.3) * 2} />
        )}
      </group>

      {/* Orbiting Fruit Elements - Always Visible around bottle */}
      <group>
        <Mango
          position={[
            Math.cos(scrollProgress * Math.PI * 2) * fruitRadius,
            Math.sin(scrollProgress * Math.PI * 1.5) * 0.6 + 0.3,
            Math.sin(scrollProgress * Math.PI * 2) * fruitRadius * 0.5,
          ]}
          scale={0.85}
          speed={1.2}
        />
        <Orange
          position={[
            Math.cos(scrollProgress * Math.PI * 2 + 2) * fruitRadius * 1.1,
            Math.sin(scrollProgress * Math.PI * 2 + 1) * 0.5 - 0.5,
            Math.sin(scrollProgress * Math.PI * 2 + 2) * fruitRadius * 0.6,
          ]}
          scale={0.8}
          speed={1}
        />
        <Strawberry
          position={[
            Math.cos(scrollProgress * Math.PI * 2 + 4) * fruitRadius * 0.9,
            Math.sin(scrollProgress * Math.PI * 1.8 + 2) * 0.6 + 0.4,
            Math.sin(scrollProgress * Math.PI * 2 + 4) * fruitRadius * 0.5,
          ]}
          scale={0.9}
          speed={1.4}
        />
        <Lemon
          position={[
            Math.cos(scrollProgress * Math.PI * 2 + 1) * (fruitRadius + 0.6),
            -1.0,
            Math.sin(scrollProgress * Math.PI * 2 + 1) * 0.7,
          ]}
          scale={0.75}
          speed={0.9}
        />
        <WatermelonSlice
          position={[
            Math.cos(scrollProgress * Math.PI * 2 + 3) * fruitRadius * 1.1,
            1.1,
            Math.sin(scrollProgress * Math.PI * 2 + 3) * 0.5,
          ]}
          scale={0.8}
          speed={1.1}
        />
        <MintLeaf position={[-2.0, 0.7, 0.4]} scale={1.1} speed={1.3} />
        <IceCube position={[1.9, -0.5, 0.7]} scale={1.0} speed={1} />
      </group>

      {/* Ground Contact Shadow */}
      <ContactShadows position={[0, -1.9, 0]} opacity={0.6} scale={9} blur={2.2} far={4} />
    </>
  );
}

export default function HeroCanvas({ scrollProgress, accentColor }: HeroCanvasProps) {
  return (
    <div className="w-full h-full min-h-screen relative bg-gradient-to-b from-[#FFFDF8] via-[#FFF8EE] to-[#FFF5E6]">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Hero3DScene scrollProgress={scrollProgress} accentColor={accentColor} />
        </Suspense>
      </Canvas>
    </div>
  );
}
