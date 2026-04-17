"use client";

/**
 * TiltCard — wraps any children in a 3D perspective tilt container.
 * Mouse position drives rotateX / rotateY via GSAP quickTo for buttery smoothness.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./TiltCard.module.css";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt degrees (default 14)
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  depth = 12,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const rotX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
    const rotY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
    const glareTo = glareRef.current
      ? gsap.quickTo(glareRef.current, "opacity", { duration: 0.4 })
      : null;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);  // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

      rotX(-dy * depth);
      rotY(dx * depth);

      if (glareRef.current && glareTo) {
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        glareRef.current.style.background = `radial-gradient(circle at ${
          ((dx + 1) / 2) * 100
        }% ${((dy + 1) / 2) * 100}%, rgba(255,255,255,0.12) 0%, transparent 65%)`;
        glareTo(1);
      }
    };

    const handleLeave = () => {
      rotX(0);
      rotY(0);
      if (glareTo) glareTo(0);
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, [depth, glare]);

  return (
    <div ref={cardRef} className={`${styles.tilt} ${className}`} style={{ transformStyle: "preserve-3d" }}>
      {glare && <div ref={glareRef} className={styles.glare} />}
      <div className={styles.inner} style={{ transform: "translateZ(16px)" }}>
        {children}
      </div>
    </div>
  );
}
