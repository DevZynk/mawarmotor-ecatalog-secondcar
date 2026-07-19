"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sinkronisasi Lenis dengan ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Jalankan Lenis lewat GSAP ticker
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    // Hilangkan lag bawaan GSAP
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  const context = useContext(LenisContext);
  return context?.current ?? null;
}