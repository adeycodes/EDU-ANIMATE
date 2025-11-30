import React, { useRef, useEffect, useState } from 'react';
import { Scene, DrawingElement } from '../types';

interface CanvasRendererProps {
  scene: Scene;
  isPlaying: boolean;
  onComplete: () => void;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ scene, isPlaying, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas on scene change
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setProgress(0);
    startTimeRef.current = null;
    
    // Initial static draw if not playing
    if (!isPlaying) {
      drawScene(ctx, 100); // Draw fully
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, scene]);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const durationMs = scene.duration * 1000;
    
    // Calculate progress 0 to 100
    const currentProgress = Math.min((elapsed / durationMs) * 100, 100);
    setProgress(currentProgress);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx && canvas) {
      drawScene(ctx, elapsed);
    }

    if (elapsed < durationMs) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete();
    }
  };

  const drawScene = (ctx: CanvasRenderingContext2D, elapsedMs: number) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Whiteboard effect)
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<canvas.width; i+=40) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
    for(let i=0; i<canvas.height; i+=40) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
    ctx.stroke();

    scene.elements.forEach(el => {
      if (elapsedMs > el.animationDelay) {
        drawElement(ctx, el, elapsedMs - el.animationDelay);
      }
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, el: DrawingElement, elementElapsed: number) => {
    ctx.save();
    
    // Hand-drawn effect (slight jitter could be added here)
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawDuration = 1000; // Time to draw each element completely
    const drawProgress = Math.min(elementElapsed / drawDuration, 1);

    if (el.type === 'text' && el.content) {
      ctx.font = '24px "Comic Sans MS", "Chalkboard SE", sans-serif'; // Marker font style
      const charsToDraw = Math.floor(el.content.length * drawProgress);
      const text = el.content.substring(0, charsToDraw);
      ctx.fillText(text, el.x, el.y);
    } 
    else if (el.type === 'rectangle') {
      const w = (el.width || 100) * drawProgress;
      const h = el.height || 50;
      // Animate width expansion
      ctx.strokeRect(el.x, el.y, w, h);
    }
    else if (el.type === 'circle') {
      const r = (el.width || 50) / 2;
      const endAngle = (Math.PI * 2) * drawProgress;
      ctx.beginPath();
      ctx.arc(el.x + r, el.y + r, r, 0, endAngle);
      ctx.stroke();
    }
    else if (el.type === 'line') {
      const w = el.width || 100;
      const currentW = w * drawProgress;
      ctx.beginPath();
      ctx.moveTo(el.x, el.y);
      ctx.lineTo(el.x + currentW, el.y);
      ctx.stroke();
    }

    ctx.restore();
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={450} 
      className="w-full h-auto bg-white border border-slate-200 rounded-lg shadow-sm"
    />
  );
};

export default CanvasRenderer;