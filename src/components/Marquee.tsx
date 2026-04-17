"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Marquee.module.css";

const ITEMS = [
  "Social Media Strategy",
  "Visual Direction",
  "Content Production",
  "Brand Identity",
  "Campaign Execution",
  "Digital Positioning",
  "Community Growth",
  "Editorial Excellence",
];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: reverse ? totalWidth : -totalWidth,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((val: number) => {
          const mod = reverse
            ? ((parseFloat(String(val)) % totalWidth) + totalWidth) % totalWidth
            : ((parseFloat(String(val)) % -totalWidth) - totalWidth) % -totalWidth;
          return mod;
        }),
      },
    });

    return () => { tween.kill(); };
  }, [reverse]);

  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.wrapper}>
      <div ref={trackRef} className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot} aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
