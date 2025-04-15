
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    if (active) {
      const newParticles = [];
      const colors = [
        '#fd6c6c', '#00ff00', '#ffdf2b', '#4169e1', 
        '#fb01ff', '#16e6ff', '#fe8a39', '#ff4500'
      ];
      
      for (let i = 0; i < 100; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        newParticles.push(
          <motion.div
            key={i}
            className="absolute z-50"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              top: -20,
              left: `${left}%`,
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration,
              delay,
              ease: "linear"
            }}
            onAnimationComplete={() => {
              if (i === 99) { // Last particle
                setTimeout(() => {
                  setParticles([]);
                }, 1000);
              }
            }}
          />
        );
      }
      
      setParticles(newParticles);
    }
  }, [active]);
  
  if (!active && particles.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles}
    </div>
  );
};

export default Confetti;
