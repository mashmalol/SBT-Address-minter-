import React, { useEffect, useRef } from 'react';

interface Block {
  x: number;
  y: number;
  z: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
}

interface FloatingBlocksProps {
  blockCount?: number;
  colors?: string[];
}

export const FloatingBlocks: React.FC<FloatingBlocksProps> = ({ 
  blockCount = 30,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const blocks: Block[] = [];

    for (let i = 0; i < blockCount; i++) {
      blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 50 + 30,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const adjustBrightness = (color: string, percent: number) => {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, Math.min(255, (num >> 16) + amt));
      const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
      const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
      return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    };

    const drawBlock = (block: Block) => {
      const scale = 1000 / (1000 + block.z);
      const x = block.x * scale + canvas.width / 2 * (1 - scale);
      const y = block.y * scale + canvas.height / 2 * (1 - scale);
      const size = block.size * scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(block.rotation);

      ctx.globalAlpha = 0.6 * scale;
      
      // Front face
      ctx.fillStyle = block.color;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      
      // Top face (lighter)
      ctx.fillStyle = adjustBrightness(block.color, 30);
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2);
      ctx.lineTo(0, -size / 2 - size / 4);
      ctx.lineTo(size / 2, -size / 2);
      ctx.closePath();
      ctx.fill();

      // Side face (darker)
      ctx.fillStyle = adjustBrightness(block.color, -30);
      ctx.beginPath();
      ctx.moveTo(size / 2, -size / 2);
      ctx.lineTo(size / 2 + size / 4, 0);
      ctx.lineTo(size / 2 + size / 4, size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blocks.forEach(block => {
        block.rotation += block.rotationSpeed;
        block.z -= 2;
        
        if (block.z < -500) {
          block.z = 1000;
          block.x = Math.random() * canvas.width;
          block.y = Math.random() * canvas.height;
        }

        drawBlock(block);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [blockCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-black"
    />
  );
};
