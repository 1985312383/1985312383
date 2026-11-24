"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Drawing = (context: CanvasRenderingContext2D, time: number, dark: boolean) => void;

type SceneProps = {
  width: number;
  height: number;
  duration: number;
  draw: Drawing;
  onTime?: (time: number) => void;
  visibilityRef?: RefObject<HTMLElement | null>;
};

// Pause the animation clock when the diagram is off screen.
export function SceneCanvas({ width, height, duration, draw, onTime, visibilityRef }: SceneProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onTime?.(duration);
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let elapsed = motion.matches ? duration : 0;
    let visible = false;
    let previous: number | null = null;
    let frame = 0;
    let dark = document.documentElement.dataset.theme === "dark";
    let alive = true;
    let pixelWidth = width;
    let pixelHeight = height;

    function paint() {
      if (!canvas || !ctx) return;
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      draw(ctx, elapsed, dark);
      ctx.restore();
    }

    function tick(stamp: number) {
      frame = 0;
      if (previous !== null) elapsed = Math.min(duration, elapsed + stamp - previous);
      previous = stamp;
      paint();
      onTime?.(elapsed);
      if (elapsed < duration) frame = requestAnimationFrame(tick);
    }

    function schedule() {
      cancelAnimationFrame(frame);
      previous = null;
      if (motion.matches) elapsed = duration;
      paint();
      if (visible || elapsed === duration) onTime?.(elapsed);
      if (visible && !document.hidden && elapsed < duration) frame = requestAnimationFrame(tick);
    }

    function size() {
      if (!canvas) return;
      const scale = Math.min(window.devicePixelRatio || 1, 2.5);
      pixelWidth = Math.max(1, Math.round(canvas.getBoundingClientRect().width * scale));
      pixelHeight = Math.max(1, Math.round(pixelWidth * height / width));
      paint();
    }

    const theme = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme === "dark";
      paint();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const resize = new ResizeObserver(size);
    resize.observe(canvas);
    const visibility = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      schedule();
    }, { threshold: 0 });
    size();
    visibility.observe(visibilityRef?.current ?? canvas);
    motion.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    document.fonts.ready.then(() => { if (alive) paint(); });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      visibility.disconnect();
      motion.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [draw, onTime, width, height, duration, visibilityRef]);
  return <canvas ref={ref} className="machine-canvas" width={width} height={height} aria-hidden="true" />;
}
