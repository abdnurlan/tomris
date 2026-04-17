"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Scroll-aware transforms
  const navWidth = useTransform(scrollY, [0, 200], ["90%", "72%"]);
  const navTop = useTransform(scrollY, [0, 200], ["1.5rem", "0.8rem"]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return () => unsub();
  }, [scrollY]);

  // Close menu on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Backdrop blur overlay when mobile menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.menuOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main navbar pill */}
      <motion.nav
        className={`${styles.navbarContainer} ${scrolled ? styles.scrolled : ""}`}
        style={{ width: navWidth, top: navTop }}
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
      >
        {/* Wordmark */}
        <Link href="/" className={styles.logo}>
          <span className={styles.wordmark}>Tomris</span>
        </Link>

        {/* Desktop Links */}
        <ul className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.navItem}>
                <span className={styles.navItemInner}>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button – desktop */}
        <Link href="#contact" className={styles.ctaBtn}>
          Get in touch
        </Link>

        {/* Mobile Hamburger */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <motion.span
            key={isOpen ? "x" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {isOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
          </motion.span>
        </button>
        {/* Mobile dropdown menu attached to navbar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Decorative glow */}
              <div className={styles.menuGlow} />

              <ul className={styles.mobileNavLinks}>
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <Link
                      href={link.href}
                      className={styles.mobileNavItem}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.mobileNavIndex}>0{i + 1}</span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Bottom CTA inside mobile menu */}
              <motion.div
                className={styles.mobileCta}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
              >
                <Link
                  href="#contact"
                  className={styles.mobileCtaBtn}
                  onClick={() => setIsOpen(false)}
                >
                  Get in touch →
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
