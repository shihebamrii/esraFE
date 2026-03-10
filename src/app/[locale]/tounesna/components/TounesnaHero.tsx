"use client";

import React, { useEffect, useRef, useState } from "react";

/*
════════════════════════════════════════════════════════════
CONFIGURATION
════════════════════════════════════════════════════════════
*/

const IMAGE_WIDTH = "150%";
const IMAGE_HEIGHT = "150%";
const IMAGE_OFFSET_Y = "6%";

const STATS = [
  { label: "Regions", value: 24 },
  { label: "Cities", value: 279 },
  { label: "Years of History", value: 3000, suffix: "+" },
];


/*
════════════════════════════════════════════════════════════
COUNTER COMPONENT
════════════════════════════════════════════════════════════
*/

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;

      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);

      setCount(Math.floor(percent * value));

      if (percent < 1) requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}


/*
════════════════════════════════════════════════════════════
MAIN HERO
════════════════════════════════════════════════════════════
*/

export function TounesnaHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  /*
  VIDEO AUTOPLAY FIX
  */

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  /*
  MOUSE PARALLAX
  */

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#6a0d2e]"
    >
      {/* VIDEO BACKGROUND */}

      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* CINEMATIC GRADIENT OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#6a0d2e] z-[1]" />

      {/* PARALLAX IMAGE */}

      <div
        className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none transition-transform duration-200"
        style={{
          transform: `translate(${mouse.x}px, ${mouse.y}px)`
        }}
      >
        <img
          src="/hero-hq-transp.png"
          alt=""
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            objectFit: "contain",
            transform: `translateY(${IMAGE_OFFSET_Y})`
          }}
        />
      </div>

      {/* FLOATING PARTICLES */}

      <div className="absolute inset-0 z-[3] pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-[#ffcc1a]/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* CONTENT */}

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

        {/* DECORATIVE DIVIDER */}

        <div className="flex items-center gap-4 mb-6 hero-fade-1">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#fff9e6]/30" />
          <span className="text-[#ffcc1a] text-xl">✦</span>
          <span className="text-[12px] tracking-[0.55em] uppercase text-[#fff9e6] font-bold">
            تونسنا
          </span>
          <span className="text-[#ffcc1a] text-xl">✦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#fff9e6]/30" />
        </div>

        {/* TITLE */}

        <h1 className="font-serif leading-[1.1] mb-6 hero-fade-2">
          <span className="block text-[#fff9e6] text-6xl md:text-8xl font-light drop-shadow-md">
            Tounesna
          </span>

          <span className="block mt-4 text-sm md:text-lg tracking-[0.3em] uppercase font-semibold text-[#ffcc1a]">
            Photo prise lors de 
            <br />
            la tournée CnBees
          </span>
        </h1>

        {/* BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-5 hero-fade-4">

          <button
            className="group relative overflow-hidden bg-[#ffcc1a] text-[#6a0d2e] font-bold py-4 px-10 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:scale-105"
            onClick={() =>
              document
                .getElementById("tounesna-content")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore the Map
          </button>

          <button
            className="text-[#fff9e6] font-semibold text-xs tracking-[0.25em] uppercase py-4 px-8 border-2 border-[#fff9e6]/20 rounded-full hover:border-[#ffcc1a] transition-colors"
            onClick={() =>
              document
                .getElementById("gallery-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Collection
          </button>
        </div>

        {/* STATS */}

        <div className="flex flex-wrap items-center justify-center gap-12 mt-16 hero-fade-5">

          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
                    <span className="text-[#ffcc1a] text-4xl md:text-5xl font-bold">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </span>

                    <br />
                    <div className="h-1"></div>

                    <span className="text-[#ffcc1a]/60 text-[10px] tracking-[0.25em] uppercase font-bold">
                      {stat.label}
                    </span>
            </div>
          ))}

        </div>
      </div>

      {/* SCROLL INDICATOR */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hero-fade-5">

        <span className="text-[#fff9e6]/60 text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>

        <div className="w-6 h-10 border-2 border-[#fff9e6]/20 rounded-full flex justify-center p-1.5">

          <div className="w-1.5 h-3 bg-[#ffcc1a] rounded-full animate-bounce" />

        </div>
      </div>

      {/* ANIMATIONS */}

      <style jsx>{`
        .hero-fade-1 { animation: fadeSlide 0.8s ease-out 0.4s both; }
        .hero-fade-2 { animation: fadeSlide 0.8s ease-out 0.6s both; }
        .hero-fade-4 { animation: fadeSlide 0.8s ease-out 1s both; }
        .hero-fade-5 { animation: fadeSlide 0.8s ease-out 1.2s both; }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
}