"use client";

/**
 * AwakeningSection — replaces the plain yellow intro band.
 *
 * Features:
 *  • GSAP SplitText-style word-by-word 3D stagger reveal
 *  • Each word flies in from depth (rotateX + y offset)
 *  • Animated counter numbers using GSAP
 *  • Horizontal split layout on desktop
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AwakeningSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "The Awakening of a Brand";

const STATS = [
  { end: 120, suffix: "+", label: "Brands elevated" },
  { end: 4.9, suffix: "×", label: "Avg. engagement lift", decimals: 1 },
  { end: 3, suffix: "M+", label: "Impressions delivered" },
  { end: 98, suffix: "%", label: "Client retention" },
];

function AnimatedCounter({
  end,
  suffix,
  label,
  decimals = 0,
}: {
  end: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const obj = { val: 0 };

    const tween = gsap.to(obj, {
      val: end,
      duration: 1.8,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = obj.val.toFixed(decimals);
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [end, decimals]);

  return (
    <div ref={sectionRef} className={styles.statItem}>
      <div className={styles.statValue}>
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function AwakeningSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const words = HEADLINE.split(" ");

  useEffect(() => {
    const els = wordsRef.current.filter(Boolean);
    if (!els.length || !sectionRef.current) return;

    gsap.set(els, { yPercent: 110, rotateX: -60, opacity: 0, transformOrigin: "50% 100%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
      },
    });

    tl.to(els, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.07,
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section id="approach" ref={sectionRef} className={styles.section}>
      {/* Decorative gradient orb */}
      <div className={styles.orb} aria-hidden />

      <div className={styles.inner}>
        {/* Left: headline */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>Est. 2022 — Baku, Azerbaijan</p>
          <h2 className={styles.headline} aria-label={HEADLINE}>
            {words.map((word, i) => (
              <span key={i} className={styles.wordWrapper}>
                <span
                  className={styles.word}
                  ref={(el) => { if (el) wordsRef.current[i] = el; }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Right: copy + stats */}
        <div className={styles.right}>
          <p className={styles.copy}>
            We bring brands out of the shadows. Tomris is a high-end social media
            management and visual direction agency designed for those who transcend
            the ordinary. We sculpt narrative, light, and motion into profound
            digital presence.
          </p>

          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <AnimatedCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
