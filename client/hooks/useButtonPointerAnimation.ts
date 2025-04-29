import { useEffect, useRef, useState } from 'react';

// Fork of https://codepen.io/TWilson/pen/raaGNGa

interface UseButtonPointerAnimationReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  targetRef: React.RefObject<HTMLButtonElement>;
  initializeAnimation: () => void;
}

const useButtonPointerAnimation = (): UseButtonPointerAnimationReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const canvas = canvasRef.current;
  const target = targetRef.current;

  const ctx = canvas?.getContext('2d');

  const updateCanvasSize = () => {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  // Handle window resize
  window.addEventListener('resize', updateCanvasSize);
  updateCanvasSize();

  // Mouse position
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  window.addEventListener('mousemove', e => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  });

  // Draw arrow function
  const drawArrow = () => {
    if (!canvas || !target || !ctx) return { canvasRef, targetRef };
    console.log('drawArrow');

    const x0 = mouseRef.current.x;
    const y0 = mouseRef.current.y;

    if (!x0 || !y0) return;

    // Get target center
    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Add target size
    const a = Math.atan2(cy - y0, cx - x0);
    const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
    const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

    const midX = (x0 + x1) / 2;
    const midY = (y0 + y1) / 2;
    const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
    const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
    const controlX = midX;
    const controlY = midY + offset * t;

    const r = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    const opacity = Math.min(0.75, (r - Math.max(rect.width, rect.height) / 2) / 750);

    ctx.strokeStyle = `rgba( 255, 255, 255, ${opacity})`;
    ctx.lineWidth = 1;

    // Draw curve
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(controlX, controlY, x1, y1);
    ctx.setLineDash([10, 4]);
    ctx.stroke();
    ctx.restore();

    // Draw arrowhead
    const angle = Math.atan2(y1 - controlY, x1 - controlX);
    const headLength = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - headLength * Math.cos(angle - Math.PI / 6), y1 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - headLength * Math.cos(angle + Math.PI / 6), y1 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  // Animation loop
  const animate = () => {
    if (!canvas || !target || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawArrow();

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (mounted) {
      animate();
    }
  }, [mounted]);

  const initializeAnimation = () => {
    setMounted(true);
  };

  return {
    canvasRef,
    targetRef,
    initializeAnimation,
  };
};

export default useButtonPointerAnimation;
