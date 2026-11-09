import React, { useEffect, useRef } from 'react';
import { ThemeType } from './ThemeSwitcher';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  thickness: number;
  alpha: number;
  decay: number;
  headColor: string;
  tailColor: string;
}

interface StarRainDrop {
  x: number;
  y: number;
  length: number;
  speedY: number;
  speedX: number;
  alpha: number;
  color: string;
}

interface StarfieldCanvasProps {
  theme?: ThemeType;
  triggerShower?: number;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({
  theme = 'sakura',
  triggerShower = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meteorsRef = useRef<ShootingStar[]>([]);

  // Function to create a shooting star
  const createShootingStar = (
    width: number,
    fast: boolean = false,
    themeColors: { head: string; tail: string }
  ): ShootingStar => {
    return {
      x: Math.random() * (width + 300) - 100,
      y: -50 - Math.random() * 200,
      length: Math.random() * 90 + (fast ? 140 : 80),
      speed: Math.random() * 6 + (fast ? 12 : 7),
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.15, // ~45 degree diagonal
      thickness: Math.random() * 1.5 + (fast ? 2.2 : 1.2),
      alpha: Math.random() * 0.4 + 0.6,
      decay: Math.random() * 0.008 + 0.004,
      headColor: themeColors.head,
      tailColor: themeColors.tail,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const getThemeColors = () => {
      switch (theme) {
        case 'midnight':
          return {
            stars: ['247, 211, 130', '255, 230, 160', '240, 180, 80', '255, 248, 235'],
            rain: '247, 211, 130',
            head: '#ffffff',
            tail: '#f7d382',
          };
        case 'lavender':
          return {
            stars: ['216, 180, 254', '192, 132, 252', '233, 213, 255', '255, 255, 255'],
            rain: '216, 180, 254',
            head: '#ffffff',
            tail: '#c084fc',
          };
        case 'aurora':
          return {
            stars: ['94, 234, 212', '52, 211, 153', '167, 243, 208', '255, 255, 255'],
            rain: '94, 234, 212',
            head: '#ffffff',
            tail: '#34d399',
          };
        default: // sakura
          return {
            stars: ['255, 158, 187', '255, 182, 193', '255, 220, 230', '255, 250, 252'],
            rain: '255, 182, 193',
            head: '#ffffff',
            tail: '#ff9ebb',
          };
      }
    };

    let themeColors = getThemeColors();

    // 1. Ambient Twinkling Stars
    const stars: Star[] = [];
    const starCount = Math.min(Math.floor((width * height) / 8000), 130);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.25,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: themeColors.stars[Math.floor(Math.random() * themeColors.stars.length)],
      });
    }

    // 2. Cascading Star Rain Drops (Gentle downward cosmic rain stream)
    const starRainDrops: StarRainDrop[] = [];
    const rainCount = Math.min(Math.floor(width / 22), 55);

    for (let i = 0; i < rainCount; i++) {
      starRainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 16 + 8,
        speedY: Math.random() * 2.8 + 1.8,
        speedX: Math.random() * 0.6 + 0.4, // slight diagonal drift with shooting stars
        alpha: Math.random() * 0.45 + 0.15,
        color: themeColors.rain,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Continuous shooting star spawn timer
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Render Ambient Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.twinklePhase));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.fill();

        if (s.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color}, ${currentAlpha * 0.25})`;
          ctx.fill();
        }
      }

      // Render Star Rain Drops (Cosmic Rain Flow)
      for (let i = 0; i < starRainDrops.length; i++) {
        const drop = starRainDrops[i];
        drop.y += drop.speedY;
        drop.x += drop.speedX;

        if (drop.y > height + 20) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }
        if (drop.x > width + 20) {
          drop.x = -20;
        }

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.4, drop.y - drop.length);
        ctx.strokeStyle = `rgba(${drop.color}, ${drop.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Little bright droplet head
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${drop.alpha + 0.2})`;
        ctx.fill();
      }

      // Automatically spawn graceful shooting stars regularly
      if (frameCount % 60 === 0 && Math.random() > 0.3) {
        meteorsRef.current.push(createShootingStar(width, false, themeColors));
      }

      // Render Shooting Stars (Star Rain Flow / Meteors)
      const meteors = meteorsRef.current;
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= m.decay;

        if (m.alpha <= 0 || m.x > width + 200 || m.y > height + 200) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        grad.addColorStop(0.2, m.headColor);
        grad.addColorStop(0.6, m.tailColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing Star Head Flare
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `${m.tailColor}${Math.floor(m.alpha * 60).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Handle triggered Meteor Shower cascade
  useEffect(() => {
    if (triggerShower <= 0) return;
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : window.innerWidth;

    const colors =
      theme === 'midnight'
        ? { head: '#ffffff', tail: '#f7d382' }
        : theme === 'lavender'
        ? { head: '#ffffff', tail: '#c084fc' }
        : theme === 'aurora'
        ? { head: '#ffffff', tail: '#34d399' }
        : { head: '#ffffff', tail: '#ff9ebb' };

    // Burst of 12-16 fast falling shooting stars
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        meteorsRef.current.push(createShootingStar(width, true, colors));
      }, i * 90);
    }
  }, [triggerShower, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-95"
    />
  );
};
