import { useState, useEffect } from 'react';

interface LootNotification {
  id: string;
  text: string;
  color: string;
  timestamp: number;
}

// Singleton event system for loot notifications
const listeners: Set<(notification: LootNotification) => void> = new Set();

export function emitLootNotification(text: string, color: string = '#22c55e') {
  const notification: LootNotification = {
    id: crypto.randomUUID(),
    text,
    color,
    timestamp: Date.now()
  };
  listeners.forEach(fn => fn(notification));
}

const NOTIFICATION_DURATION = 1500;

export function LootNotifications() {
  const [notifications, setNotifications] = useState<LootNotification[]>([]);
  
  useEffect(() => {
    const handler = (notification: LootNotification) => {
      setNotifications(prev => [...prev.slice(-5), notification]); // Keep max 6
    };
    
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);
  
  // Cleanup expired notifications
  useEffect(() => {
    if (notifications.length === 0) return;
    
    const timer = setInterval(() => {
      const now = Date.now();
      setNotifications(prev => prev.filter(n => now - n.timestamp < NOTIFICATION_DURATION));
    }, 100);
    
    return () => clearInterval(timer);
  }, [notifications.length]);
  
  if (notifications.length === 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }}>
      {notifications.map((n) => {
        const age = Date.now() - n.timestamp;
        const progress = Math.min(age / NOTIFICATION_DURATION, 1);
        
        return (
          <div
            key={n.id}
            style={{
              color: n.color,
              fontSize: '1.25rem',
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              textShadow: `0 2px 8px ${n.color}80, 0 0 20px ${n.color}40`,
              opacity: 1 - progress,
              transform: `translateY(${-progress * 30}px) scale(${1 + progress * 0.1})`,
              transition: 'none',
              willChange: 'transform, opacity'
            }}
          >
            {n.text}
          </div>
        );
      })}
      
      <style>{`
        @keyframes loot-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

