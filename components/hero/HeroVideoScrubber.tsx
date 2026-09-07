'use client';

import React, { useRef, useEffect } from 'react';

interface HeroVideoScrubberProps {
  scrollProgress: number; // 0 to 1
  videoSrc?: string;
  posterSrc?: string;
}

export default function HeroVideoScrubber({
  scrollProgress,
  videoSrc = '/freshsip-blend-hero.mp4',
  posterSrc = '/assets/images/mango-harvest-real.jpg',
}: HeroVideoScrubberProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync scrollProgress (0..1) directly to video.currentTime without standard video UI
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (video.duration && !isNaN(video.duration)) {
        const targetTime = scrollProgress * video.duration;
        // Smooth frame seeking
        video.currentTime = Math.min(video.duration - 0.01, Math.max(0, targetTime));
      }
    };

    if (video.readyState >= 1) {
      updateTime();
    } else {
      video.addEventListener('loadedmetadata', updateTime);
      return () => video.removeEventListener('loadedmetadata', updateTime);
    }
  }, [scrollProgress]);

  return (
    <div className="w-full h-full min-h-screen relative flex items-center justify-center bg-gradient-to-b from-[#FFFDF8] via-[#FFF8EE] to-[#FFF5E6] overflow-hidden select-none pointer-events-none">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center scale-105"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
