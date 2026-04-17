"use client";

import styles from "./page.module.css";
import HeroCanvas from "@/components/HeroCanvas";
import AwakeningSection from "@/components/AwakeningSection";
import Marquee from "@/components/Marquee";
import TiltCard from "@/components/TiltCard";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  Variants,
} from "framer-motion";
import { useRef, useState } from "react";

/* ─── Animation presets ─────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 55, damping: 18, mass: 0.8 },
  },
};

/* ─── Data ──────────────────────────────────────────────────── */
const SERVICES = [
  { index: "01", title: "Social Media Strategy", desc: "Data-driven, emotionally intelligent roadmaps that position your brand precisely at the intersection of culture and commerce.", tag: "Strategy" },
  { index: "02", title: "Content Production", desc: "Cinematic, editorial, and platform-native content creation that arrests the scroll and commands absolute attention.", tag: "Creative" },
  { index: "03", title: "Visual Direction", desc: "Relentless art direction and aesthetic curation ensuring a completely unified, world-class brand narrative.", tag: "Direction" },
  { index: "04", title: "Campaign Execution", desc: "End-to-end orchestration of high-impact rollout strategies for maximum resonance and enduring impact.", tag: "Execution" },
  { index: "05", title: "Community Growth", desc: "Cultivating brand loyalists through authentic, restrained, and elegant digital interaction.", tag: "Growth" },
  { index: "06", title: "Digital Positioning", desc: "Elevating perception, securing cultural relevance, and defining modern luxury for a new era.", tag: "Branding" },
];

const WORKS = [
  { num: "01", title: "Lux Apparel", category: "Visual Direction", gradient: "linear-gradient(135deg,#1a1a1a 0%,#2a2a1a 100%)" },
  { num: "02", title: "Noir Beverages", category: "Campaign Execution", gradient: "linear-gradient(135deg,#0d1117 0%,#1a0d1a 100%)" },
  { num: "03", title: "Atlas Hotels", category: "Brand Identity", gradient: "linear-gradient(135deg,#111827 0%,#0a1628 100%)" },
];

const FAQS = [
  { q: "What industries do you specialise in?", a: "We work with luxury, lifestyle, hospitality, fashion, and high-growth consumer brands that value aesthetic precision." },
  { q: "How long does onboarding take?", a: "Our onboarding process takes 7–10 business days, including strategy alignment, brand audit, and content calendar setup." },
  { q: "Do you offer one-off projects?", a: "Our core model is retainer-based, ensuring continuity and compounding brand value. We do consider select one-off campaigns." },
  { q: "What does pricing look like?", a: "Packages start from $2,400/month depending on scope. Every engagement is custom-quoted after a discovery call." },
];

/* ─── Sub-components ────────────────────────────────────────── */
function ServiceCard({ s }: { s: typeof SERVICES[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={cardVariant} className={styles.serviceCardWrapper}>
      <TiltCard className={styles.serviceCard} depth={10}>
        <div
          className={styles.serviceCardInner}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={styles.cardTop}>
            <span className={styles.cardIndex}>{s.index}</span>
            <motion.span
              className={styles.cardTag}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
              transition={{ duration: 0.25 }}
            >
              {s.tag}
            </motion.span>
          </div>
          <h3 className={styles.cardTitle}>{s.title}</h3>
          <p className={styles.cardDesc}>{s.desc}</p>
          <motion.div
            className={styles.cardArrow}
            animate={{ x: hovered ? 8 : 0, opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            →
          </motion.div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function WorkCard({ w }: { w: typeof WORKS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={cardVariant}>
      <TiltCard className={styles.workCard} depth={8} glare>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={styles.workImageWrap} style={{ background: w.gradient }}>
            <motion.div
              className={styles.workOverlay}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.workViewLabel}>View Project →</span>
            </motion.div>
            <span className={styles.workNum}>{w.num}</span>
          </div>
          <div className={styles.workMeta}>
            <h4>{w.title}</h4>
            <p>{w.category}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={styles.faqItem}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    >
      <button className={styles.faqQ} onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={styles.faqIcon}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.faqA}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function Home() {
  const philosophyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: philProgress } = useScroll({
    target: philosophyRef,
    offset: ["start end", "end start"],
  });
  const philY = useTransform(philProgress, [0, 1], [80, -80]);

  return (
    <main className={styles.main}>

      {/* ── Hero canvas ────────────────────────────────────────── */}
      <HeroCanvas />

      {/* ── Marquee strip between hero and awakening ─────────── */}
      <div className={styles.marqueeWrap}>
        <Marquee />
      </div>

      {/* ── Awakening section (GSAP 3D word reveal) ──────────── */}
      <AwakeningSection />

      {/* ── Services (3D TiltCards) ────────────────────────────  */}
      <section id="services" className={styles.darkSection}>
        <div className={styles.container}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p className={styles.overlineDark} variants={fadeUp}>What we do</motion.p>
            <motion.h2 className={styles.headingDark} variants={fadeUp}>Our Expertise</motion.h2>
          </motion.div>

          <motion.div
            className={styles.servicesGrid}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {SERVICES.map((s) => (
              <ServiceCard key={s.index} s={s} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Second marquee (reversed) ─────────────────────────── */}
      <div className={styles.marqueeWrap}>
        <Marquee reverse />
      </div>

      {/* ── Philosophy ────────────────────────────────────────── */}
      <section id="philosophy" className={styles.philosophySection} ref={philosophyRef}>
        <motion.div className={styles.philosophyBg} style={{ y: philY }} />
        <div className={styles.philosophyInner}>
          <motion.div
            className={styles.splitContainer}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div className={styles.splitLeft} variants={fadeUp}>
              <p className={styles.overline}>Our belief</p>
              <h2 className={styles.heading} style={{ textAlign: "left" }}>Our Philosophy</h2>
              <p className={styles.philosophyTagline}>
                Quality over quantity.<br />
                Meaning over noise.<br />
                Precision over panic.
              </p>
            </motion.div>
            <motion.div className={styles.splitRight} variants={fadeUp}>
              <p className={styles.introPara} style={{ color: "var(--background)", opacity: 0.75, textAlign: "left" }}>
                The digital landscape is crowded with brands fighting for mere seconds of attention.
                We believe that true luxury and enduring presence aren&apos;t built by shouting the loudest,
                but by speaking with absolute clarity and undeniable visual gravity.
              </p>
              <p className={styles.introPara} style={{ color: "var(--background)", opacity: 0.75, marginTop: "1.5rem", textAlign: "left" }}>
                Every post, every campaign, every interaction is an opportunity to reinforce your brand&apos;s narrative.
                We treat your social channels not as marketing feeds, but as curated digital galleries.
              </p>
              <div className={styles.philosophyPills}>
                {["Editorial Thinking", "Premium Execution", "Measurable Impact"].map((t) => (
                  <motion.span
                    key={t}
                    className={styles.pill}
                    whileHover={{ scale: 1.06, background: "rgba(0,0,0,0.14)" }}
                    transition={{ duration: 0.2 }}
                  >{t}</motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Selected Works ─────────────────────────────────────── */}
      <section id="work" className={styles.darkSection}>
        <div className={styles.container}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p className={styles.overlineDark} variants={fadeUp}>Portfolio</motion.p>
            <motion.h2 className={styles.headingDark} variants={fadeUp}>Selected Works</motion.h2>
          </motion.div>

          <motion.div
            className={styles.workGrid}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {WORKS.map((w) => (
              <WorkCard key={w.num} w={w} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <motion.p
            className={styles.overline}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Got questions?
          </motion.p>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{ marginBottom: "3rem" }}
          >
            FAQ
          </motion.h2>
          <div className={styles.faqList}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── Contact / Footer ───────────────────────────────────── */}
      <section id="contact" className={styles.contactSection}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, scale: 0.97, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          viewport={{ once: true }}
        >
          <p className={styles.overlineDark}>Ready to grow?</p>
          <h2 className={styles.headingDark} style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            Start the Conversation
          </h2>
          <p className={styles.contactSub}>Let&apos;s build a profound digital legacy together.</p>
          <motion.a
            href="mailto:hello@tomristeam.com"
            className={styles.ctaBlock}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            hello@tomristeam.com →
          </motion.a>
          <div className={styles.footer}>
            © {new Date().getFullYear()} TomrisTeam. Crafted with precision.
          </div>
        </motion.div>
      </section>
    </main>
  );
}
