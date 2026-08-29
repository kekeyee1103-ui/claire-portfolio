import { ArrowUpRight, Layers } from 'lucide-react';
import type { CSSProperties } from 'react';
import FadeIn from './FadeIn';
import type { Program } from '../content/types';
import { UI, type Lang } from '../i18n';

function ArtPlaceholder({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border-b border-[#C9A24B]/20 bg-gradient-to-br from-[#161209] to-[#241B0C] ${className ?? ''}`}
      style={style}
    >
      <Layers size={32} strokeWidth={1} className="text-[#C9A24B]/70" />
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#EFE9DC]/40">Artwork</span>
    </div>
  );
}

function ProgramCard({
  program,
  index,
  lang,
}: {
  program: Program;
  index: number;
  lang: Lang;
}) {
  const s = UI[lang];
  const number = String(index + 1).padStart(2, '0');

  return (
    <FadeIn delay={index * 0.08} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#C9A24B]/25 bg-gradient-to-b from-[#15110A] to-[#0F0D09] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/60">
        <div className="relative">
          {program.art ? (
            <img
              src={program.art}
              alt={`${program.name} 项目配图`}
              loading="lazy"
              draggable={false}
              className="h-40 w-full border-b border-[#C9A24B]/20 object-cover sm:h-44"
            />
          ) : (
            <ArtPlaceholder className="h-40 w-full sm:h-44" />
          )}
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[#E8CD8A] backdrop-blur-sm">
            {number}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C9A24B] sm:text-[11px]">
            {lang === 'en' ? program.categoryEn : program.categoryCn}
          </p>
          <h3 className="mt-1.5 truncate text-lg font-medium uppercase text-[#EFE9DC] sm:text-xl">
            {program.name}
          </h3>
          <p className="mt-2.5 line-clamp-3 flex-1 text-[13px] font-light leading-relaxed text-[#EFE9DC]/55">
            {program.desc}
          </p>
          {program.url && (
            <a
              href={program.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 self-start text-xs font-medium uppercase tracking-[0.25em] text-[#C9A24B] transition-colors duration-200 hover:text-[#E8CD8A]"
            >
              {s.visitSite}
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
      </article>
    </FadeIn>
  );
}

export default function ProjectsSection({ lang, programs }: { lang: Lang; programs: Program[] }) {
  const s = UI[lang];

  return (
    <section
      id="portfolio"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-32 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn y={40}>
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.4em] text-[#C9A24B] sm:text-sm">
          {s.programEyebrow}
        </p>
        <h2 className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {s.programHeading}
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-6xl">
        {programs.length === 0 ? (
          <FadeIn>
            <div className="flex min-h-[240px] items-center justify-center rounded-[40px] border border-dashed border-[#C9A24B]/35">
              <p className="text-sm font-light tracking-widest text-[#EFE9DC]/50">{s.programEmpty}</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <ProgramCard key={`${program.name}-${i}`} program={program} index={i} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
