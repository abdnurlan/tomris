"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./HeroCanvas.module.css";
import Image from "next/image";

const TOTAL_FRAMES_DESKTOP = 240;
const TOTAL_FRAMES_MOBILE = 208;

const getFramePath = (index: number, isMobile: boolean) => {
  const paddedIndex = index.toString().padStart(3, "0");
  const folder = isMobile ? "frames%20mobile" : "frames";
  return `/${folder}/ezgif-frame-${paddedIndex}.jpg`;
};

// Canvas object-fit: cover implementation
const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) => {
  const offsetX = 0.5;
  const offsetY = 0.5;
  const iw = img.width;
  const ih = img.height;
  let r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let ar = 1;

  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  let cw = iw / (nw / w);
  let ch = ih / (nh / h);
  let cx = (iw - cw) * offsetX;
  let cy = (ih - ch) * offsetY;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
};

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Use a ref for the current frame to avoid dependency issues in requestAnimationFrame
  const currentFrameRef = useRef(0);
  
  useEffect(() => {
    const checkMobile = () => window.innerWidth <= 768;
    setIsMobile(checkMobile());
    setIsReady(true);

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Preload images
  useEffect(() => {
    if (!isReady) return;

    const totalFrames = isMobile ? TOTAL_FRAMES_MOBILE : TOTAL_FRAMES_DESKTOP;
    const loadedImages: HTMLImageElement[] = new Array(totalFrames + 1);
    let loaded = 0;
    
    setLoadedCount(0);
    setIsFullyLoaded(false);
    
    // Prioritize first few frames so it renders right away
    const prioritizeIndices = [1, 2, 3, 4, 5];
    const restIndices = Array.from({ length: totalFrames }, (_, i) => i + 1).filter(i => !prioritizeIndices.includes(i));
    
    const loadSequence = [...prioritizeIndices, ...restIndices];

    let isCancelled = false;

    loadSequence.forEach((index) => {
      const img = new window.Image();
      img.src = getFramePath(index, isMobile);
      img.onload = () => {
        if (isCancelled) return;
        loadedImages[index] = img;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setIsFullyLoaded(true);
        }
        
        // Draw the very first frame immediately if it just loaded and we are at top
        if (index === 1 && currentFrameRef.current <= 1) {
          // Pass the image directly so we don't rely on the state being updated
          // Adding a safe way to call renderFrame with the local context, escaping infinite update loop
          // by letting it execute safely without adding it to dependency array
          renderFrame(1, loadedImages[1]);
        }
      };
    });

    setImages(loadedImages);

    return () => {
      isCancelled = true;
    };
  }, [isReady, isMobile]);

  const renderFrame = useCallback((frameIndex: number, imgSource?: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgSource || images[frameIndex];
    if (!img || !img.complete) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    } else {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    drawImageCover(ctx, img, rect.width, rect.height);
  }, [images]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      renderFrame(Math.max(1, currentFrameRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  // Handle Scroll
  useEffect(() => {
    if (!isReady) return;
    let ticking = false;
    const currentTotalFrames = isMobile ? TOTAL_FRAMES_MOBILE : TOTAL_FRAMES_DESKTOP;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          
          const rect = containerRef.current.getBoundingClientRect();
          const elementTop = rect.top;
          
          // Total scrollable distance equals container height minus viewport height
          const maxScroll = rect.height - window.innerHeight;
          let scrollProgress = -elementTop / maxScroll;
          
          // Clamp
          if (scrollProgress < 0) scrollProgress = 0;
          if (scrollProgress > 1) scrollProgress = 1;

          // Map to frame index (1 to 240) but finish earlier (at 85% of the scroll track)
          // Normalize scroll progress to finish early
          const animationFinishPoint = 0.85; 
          let normalizedProgress = scrollProgress / animationFinishPoint;
          
          const targetFrame = Math.max(1, Math.min(currentTotalFrames, Math.ceil(normalizedProgress * currentTotalFrames)));
          
          if (targetFrame !== currentFrameRef.current) {
            currentFrameRef.current = targetFrame;
            setCurrentFrame(targetFrame);
            renderFrame(targetFrame);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [renderFrame, isReady, isMobile]);

  return (
    <div ref={containerRef} className={styles.heroContainer}>
      <div className={styles.stickyArea}>
        {loadedCount < 5 && (
          <div className={`${styles.loader} ${loadedCount >= 1 ? styles.hidden : ""}`}>
            INITIALIZING
          </div>
        )}
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
}
