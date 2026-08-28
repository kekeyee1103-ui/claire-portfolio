import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Layers } from 'lucide-react';
import type { CSSProperties } from 'react';
import FadeIn from './FadeIn';
import GhostButton from './GhostButton';
import type { Program } from '../content/types';

function ArtPlaceholder({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 border border-[#C9A24B]/25 bg-gradient-to-br from-[#161209] to-[#241B0C] ${className ?? ''}`}
      style={style}
    >
      <Layers size={44} strokeWidth={1} className="text-[#C9A24B]/70" />
      <span className="text-xs uppercase tracking-[0.3em] text-[#EFE9DC]/40">Artwork</span>
    </div>
  );
}

function StackCard({
  program,
  index,
  total,
  progress,
}: {
  program: Program;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="sticky" style={{ top: `calc(clamp(6rem, 10vw, 8rem) + ${index * 28}px)` }}>
      <motion.article
        style={{ scale }}
        className="mb-6 rounded-[40px] border-2 border-[#C9A24B]/55 bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-2 pb-6 pt-2 md:px-4">
          <span className="hero-heading shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
            {number}
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.3em] text-[#C9A24B] sm:text-xs">
              {program.categoryEn} · {program.categoryCn}
            </p>
            <h3 className="truncate text-xl font-medium uppercase text-[#EFE9DC] sm:text-2xl md:text-3xl">
              {program.name}
            </h3>
          </div>
          {program.url && <GhostButton label="Visit Site" href={program.url} />}
        </div>

        <p className="mb-6 max-w-3xl px-2 font-light leading-relaxed text-[#EFE9DC]/60 md:px-4" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}>
          {program.desc}
        </p>

        <div className="px-2 pb-2 md:px-4">
          {program.art ? (
            <img
              src={program.art}
              alt={`${program.name} 项目配图`}
              loading="lazy"
              draggable={false}
              className="w-full rounded-[28px] border border-[#C9A24B]/25 object-cover sm:rounded-[36px] md:rounded-[44px]"
              style={{ height: 'clamp(260px, 36vw, 480px)' }}
            />
          ) : (
            <ArtPlaceholder
              className="w-full rounded-[28px] sm:rounded-[36px] md:rounded-[44px]"
              style={{ height: 'clamp(260px, 36vw, 480px)' }}
            />
          )}
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection({ programs }: { programs: Program[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="portfolio"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-32 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn y={40}>
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.4em] text-[#C9A24B] sm:text-sm">
          Selected Works
        </p>
        <h2 className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Program
        </h2>
      </FadeIn>

      <div ref={containerRef} className="mx-auto max-w-6xl">
        {programs.length === 0 ? (
          <FadeIn>
            <div className="flex min-h-[240px] items-center justify-center rounded-[40px] border border-dashed border-[#C9A24B]/35">
              <p className="text-sm font-light tracking-widest text-[#EFE9DC]/50">内容待更新</p>
            </div>
          </FadeIn>
        ) : (
          programs.map((program, i) => (
            <div key={`${program.name}-${i}`} className="h-[85vh]">
              <StackCard
                program={program}
                index={i}
                total={programs.length}
                progress={scrollYProgress}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
