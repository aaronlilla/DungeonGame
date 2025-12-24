import { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  decay: number;
  color: { r: number; g: number; b: number };
  flickerSpeed: number;
  flickerPhase: number;
  wobbleSpeed: number;
  wobblePhase: number;
  wobbleAmount: number;
  rotation: number;
  rotationSpeed: number;
  elongation: number; // How stretched the ember is (1 = circle, 2+ = elongated)
  type: 'spark' | 'ash' | 'ember' | 'fastSpark'; // Different visual types
}

interface EmberBackgroundProps {
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  colorScheme?: 'fire' | 'purple' | 'blue' | 'green';
}

const COLOR_SCHEMES = {
  fire: [
    { r: 255, g: 120, b: 40 },   // Warm orange
    { r: 255, g: 80, b: 20 },    // Deep orange
    { r: 220, g: 60, b: 15 },    // Ember red
    { r: 255, g: 160, b: 60 },   // Light orange
    { r: 180, g: 40, b: 10 },    // Dark ember
    { r: 255, g: 200, b: 80 },   // Occasional bright spark
  ],
  purple: [
    { r: 180, g: 80, b: 255 },
    { r: 140, g: 60, b: 200 },
    { r: 220, g: 120, b: 255 },
    { r: 100, g: 40, b: 180 },
    { r: 200, g: 150, b: 255 },
  ],
  blue: [
    { r: 80, g: 150, b: 255 },
    { r: 40, g: 120, b: 220 },
    { r: 120, g: 180, b: 255 },
    { r: 60, g: 100, b: 200 },
    { r: 150, g: 200, b: 255 },
  ],
  green: [
    { r: 80, g: 255, b: 120 },
    { r: 40, g: 200, b: 80 },
    { r: 120, g: 255, b: 150 },
    { r: 60, g: 180, b: 100 },
    { r: 150, g: 255, b: 180 },
  ],
};

const INTENSITY_CONFIG = {
  low: { count: 40, spawnRate: 0.15 },
  medium: { count: 70, spawnRate: 0.25 },
  high: { count: 120, spawnRate: 0.4 },
  extreme: { count: 200, spawnRate: 0.6 },
};

export function EmberBackground({ 
  intensity = 'high', 
  colorScheme = 'fire' 
}: EmberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = INTENSITY_CONFIG[intensity];
    const colors = COLOR_SCHEMES[colorScheme];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createEmber = (fromBottom = true): Ember => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Determine particle type
      const typeRoll = Math.random();
      let type: 'spark' | 'ash' | 'ember' | 'fastSpark';
      let size: number;
      let elongation: number;
      let speedY: number;
      let speedX: number;
      let opacity: number;
      let decay: number;
      let flickerSpeed: number;
      
      if (typeRoll < 0.45) {
        // Ash flakes - small, elongated, flat - travel far
        type = 'ash';
        size = Math.random() * 1.2 + 0.4;
        elongation = Math.random() * 2.5 + 2;
        speedY = -(Math.random() * 0.8 + 0.4); // 3x faster
        speedX = (Math.random() - 0.5) * 0.5;
        opacity = Math.random() * 0.5 + 0.3;
        decay = Math.random() * 0.0003 + 0.0001;
        flickerSpeed = Math.random() * 0.04 + 0.01;
      } else if (typeRoll < 0.75) {
        // Embers - small glowing particles - travel far
        type = 'ember';
        size = Math.random() * 1.0 + 0.3;
        elongation = Math.random() * 1.5 + 1;
        speedY = -(Math.random() * 1.0 + 0.5); // 3x faster
        speedX = (Math.random() - 0.5) * 0.6;
        opacity = Math.random() * 0.6 + 0.4;
        decay = Math.random() * 0.0004 + 0.00015;
        flickerSpeed = Math.random() * 0.05 + 0.02;
      } else if (typeRoll < 0.88) {
        // Regular sparks - medium speed streaks
        type = 'spark';
        size = Math.random() * 0.6 + 0.2;
        elongation = Math.random() * 3 + 2;
        speedY = -(Math.random() * 1.5 + 0.8); // 3x faster
        speedX = (Math.random() - 0.5) * 0.8;
        opacity = Math.random() * 0.5 + 0.5;
        decay = Math.random() * 0.0008 + 0.0003;
        flickerSpeed = Math.random() * 0.15 + 0.08;
      } else {
        // Fast sparks - shoot up quickly, very bright, fade fast
        type = 'fastSpark';
        size = Math.random() * 0.5 + 0.15;
        elongation = Math.random() * 5 + 4;
        speedY = -(Math.random() * 4 + 3); // Even faster!
        speedX = (Math.random() - 0.5) * 1.5;
        opacity = Math.random() * 0.3 + 0.7;
        decay = Math.random() * 0.005 + 0.004;
        flickerSpeed = Math.random() * 0.25 + 0.15;
      }
      
      return {
        x: Math.random() * canvas.width,
        y: fromBottom ? canvas.height + 10 : Math.random() * canvas.height,
        size,
        speedX,
        speedY,
        opacity,
        decay,
        color,
        flickerSpeed,
        flickerPhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.012 + 0.004,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleAmount: Math.random() * 12 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        elongation,
        type,
      };
    };

    // Initialize embers
    embersRef.current = [];
    for (let i = 0; i < config.count; i++) {
      embersRef.current.push(createEmber(false));
    }

    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new embers
      if (Math.random() < config.spawnRate) {
        embersRef.current.push(createEmber(true));
      }
      
      // Extra chance to spawn fast sparks for visual interest
      if (Math.random() < 0.04) {
        const fastSpark = createEmber(true);
        // Force it to be a fast spark
        fastSpark.type = 'fastSpark';
        fastSpark.speedY = -(Math.random() * 5 + 4); // Very fast
        fastSpark.speedX = (Math.random() - 0.5) * 2;
        fastSpark.opacity = Math.random() * 0.2 + 0.8;
        fastSpark.decay = Math.random() * 0.006 + 0.005;
        fastSpark.elongation = Math.random() * 6 + 5;
        fastSpark.size = Math.random() * 0.4 + 0.15;
        embersRef.current.push(fastSpark);
      }

      // Update and draw embers
      embersRef.current = embersRef.current.filter(ember => {
        // Update position with gentle wobble
        ember.wobblePhase += ember.wobbleSpeed;
        ember.flickerPhase += ember.flickerSpeed;
        ember.rotation += ember.rotationSpeed;
        
        ember.x += ember.speedX + Math.sin(ember.wobblePhase) * 0.15;
        ember.y += ember.speedY;
        ember.opacity -= ember.decay;

        // Very subtle wind effect
        ember.speedX += (Math.random() - 0.5) * 0.008;
        ember.speedX *= 0.995; // Gentle damping

        // Remove if faded or off screen
        if (ember.opacity <= 0 || ember.y < -20) {
          return false;
        }

        // Flicker effect
        const flicker = 0.75 + Math.sin(ember.flickerPhase) * 0.25;
        const currentOpacity = ember.opacity * flicker;
        const { r, g, b } = ember.color;

        ctx.save();
        ctx.translate(ember.x, ember.y);
        
        // Fast sparks orient in direction of movement (pointing up)
        if (ember.type === 'fastSpark') {
          const angle = Math.atan2(ember.speedY, ember.speedX);
          ctx.rotate(angle);
        } else {
          ctx.rotate(ember.rotation);
        }

        if (ember.type === 'ash') {
          // Ash flakes - thin, elongated, sharp edges
          const width = ember.size * ember.elongation;
          const height = ember.size * 0.3;
          
          // Sharp ash body - darker with glowing edge
          ctx.beginPath();
          ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.floor(r * 0.5)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.3)}, ${currentOpacity * 0.85})`;
          ctx.fill();
          
          // Bright ember edge along one side
          ctx.beginPath();
          ctx.ellipse(width * 0.3, 0, width * 0.4, height * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.6})`;
          ctx.fill();

        } else if (ember.type === 'spark') {
          // Sparks - sharp bright streaks
          const length = ember.size * ember.elongation;
          const thickness = ember.size * 0.3;
          
          // Sharp bright core
          ctx.beginPath();
          ctx.ellipse(0, 0, length, thickness, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 40)}, ${b}, ${currentOpacity})`;
          ctx.fill();
          
          // Hot center
          ctx.beginPath();
          ctx.ellipse(0, 0, length * 0.4, thickness * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, r + 120)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 60)}, ${currentOpacity})`;
          ctx.fill();

        } else if (ember.type === 'fastSpark') {
          // Fast sparks - very bright, sharp shooting streaks
          const length = ember.size * ember.elongation * 2;
          const thickness = ember.size * 0.25;
          
          // Tail (fading)
          ctx.beginPath();
          ctx.ellipse(-length * 0.3, 0, length * 0.6, thickness * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity * 0.4})`;
          ctx.fill();
          
          // Main body
          ctx.beginPath();
          ctx.ellipse(0, 0, length * 0.5, thickness, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 60)}, ${b}, ${currentOpacity})`;
          ctx.fill();
          
          // Hot head
          ctx.beginPath();
          ctx.arc(length * 0.3, 0, thickness * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, ${Math.min(255, g + 150)}, ${Math.min(255, b + 100)}, ${currentOpacity})`;
          ctx.fill();
          
          // White-hot center
          ctx.beginPath();
          ctx.arc(length * 0.35, 0, thickness * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.fill();

        } else {
          // Embers - small sharp glowing particles
          const width = ember.size * ember.elongation;
          const height = ember.size * 0.7;
          
          // Main body - solid color
          ctx.beginPath();
          ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
          ctx.fill();
          
          // Bright center
          const hotR = Math.min(255, r + 100);
          const hotG = Math.min(255, g + 70);
          ctx.beginPath();
          ctx.ellipse(0, 0, width * 0.5, height * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hotR}, ${hotG}, ${Math.min(255, b + 40)}, ${currentOpacity})`;
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [intensity, colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

