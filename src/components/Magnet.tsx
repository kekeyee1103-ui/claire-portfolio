import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.abs(e.clientX - cx) - rect.width / 2;
      const dy = Math.abs(e.clientY - cy) - rect.height / 2;
      if (dx < padding && dy < padding) {
        setActive(true);
        setOffset({ x: (e.clientX - cx) / strength, y: (e.clientY - cy) / strength });
      } else {
        setActive(false);
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
