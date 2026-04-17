"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./MagneticCursor.module.css";

/* ─── Trail particle ─────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  alpha: number;
  size: number;
  hue: number; // slight hue shift per particle
}

const MAX_PARTICLES = 28;
const TRAIL_SPEED = 0.08; // lower = longer persistence

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -200, y: -200 });

  /* Framer springs */
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 160, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 160, damping: 20, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 900, damping: 30 });
  const dotY = useSpring(y, { stiffness: 900, damping: 30 });

  /* ── Canvas trail loop ────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      mouseRef.current = { x: mx, y: my };
      x.set(mx);
      y.set(my);

      // Push new particle
      particles.current.push({
        x: mx,
        y: my,
        alpha: 1,
        size: Math.random() * 5 + 3,
        hue: Math.random() * 30 - 15, // ±15° around yellow (60°)
      });

      // Keep list bounded
      if (particles.current.length > MAX_PARTICLES) {
        particles.current.shift();
      }
    };

    window.addEventListener("mousemove", onMove);

    /* Hover targets → ring scale */
    const enter = () => cursorRef.current?.classList.add(styles.hovering);
    const leave = () => cursorRef.current?.classList.remove(styles.hovering);
    const targets = document.querySelectorAll("a, button, [data-cursor-hover]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    /* Draw loop */
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, i) => {
        // Fade out over time
        p.alpha -= TRAIL_SPEED;

        if (p.alpha <= 0) return;

        // Yellow-ish shimmer:  hsl(60 ± hue, 95%, 62%)   = brand yellow family
        const hsl = `hsla(${60 + p.hue}, 95%, 62%, ${p.alpha})`;

        // Outer soft glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grd.addColorStop(0, hsl);
        grd.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Inner crisp dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${60 + p.hue}, 100%, 80%, ${p.alpha * 0.9})`;
        ctx.fill();
      });

      // Remove fully faded
      particles.current = particles.current.filter((p) => p.alpha > 0);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, [x, y]);

  return (
    <>
      {/* Canvas trail layer */}
      <canvas ref={canvasRef} className={styles.trailCanvas} />

      {/* Spring-animated outer ring */}
      <motion.div
        ref={cursorRef}
        className={styles.cursor}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Instant-snap center dot */}
      <motion.div
        className={styles.dot}
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
