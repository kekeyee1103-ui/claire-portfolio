import { Briefcase, Download, GraduationCap, Trophy, type LucideIcon } from 'lucide-react';
import FadeIn from './FadeIn';
import type { JourneyGroup, JourneyIconKey } from '../content/types';
import { UI, type Lang } from '../i18n';

const ICONS: Record<JourneyIconKey, LucideIcon> = {
  edu: GraduationCap,
  trophy: Trophy,
  briefcase: Briefcase,
};

export default function JourneySection({ lang, groups }: { lang: Lang; groups: JourneyGroup[] }) {
  const s = UI[lang];
  if (groups.length === 0) return null;

  return (
    <section
      id="journey"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32"
      style={{ overflowX: 'clip' }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[70%] -translate-x-1/2 rounded-full bg-[#C9A24B] opacity-[0.05] blur-[100px]" />

      <FadeIn y={40}>
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.4em] text-[#C9A24B] sm:text-sm">
          {s.journeyEyebrow}
        </p>
        <h2 className="hero-heading mb-8 text-center font-black uppercase leading-none tracking-tight sm:mb-10" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {s.journeyHeading}
        </h2>
        <div className="mb-16 flex justify-center sm:mb-20 md:mb-28">
          <a
            href="Claire-He-Resume.pdf"
            download="何珂一_简历.pdf"
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#C9A24B]/70 px-8 py-3 text-xs font-medium uppercase tracking-widest text-[#EFE9DC] transition-colors duration-300 hover:bg-[#C9A24B]/10 sm:px-10 sm:py-3.5 sm:text-sm"
          >
            <Download size={16} />
            {s.downloadResume}
          </a>
        </div>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {groups.map((group, gi) => {
          const Icon = ICONS[group.iconKey] ?? GraduationCap;
          const groupTitle = lang === 'en' ? (s.groupTitles[group.iconKey] ?? group.titleCn) : group.titleCn;
          return (
            <div key={group.titleCn} className={gi > 0 ? 'mt-20 sm:mt-28' : ''}>
              <FadeIn className="mb-4 flex items-center gap-4">
                <Icon size={26} strokeWidth={1.2} className="text-[#C9A24B]" />
                <h3 className="text-xl font-black tracking-[0.15em] text-[#EFE9DC] sm:text-2xl">
                  {groupTitle}
                </h3>
                <span
                  className="ml-2 hidden h-px flex-1 sm:block"
                  style={{ background: 'linear-gradient(90deg, rgba(201,162,75,0.4), transparent)' }}
                />
              </FadeIn>

              {group.items.map((item, ii) => (
                <FadeIn
                  key={`${item.org}-${ii}`}
                  delay={ii * 0.08}
                  className="grid gap-3 border-t py-8 sm:grid-cols-[190px_1fr] sm:gap-8 sm:py-10"
                  style={{ borderColor: 'rgba(201,162,75,0.16)' }}
                >
                  <p className="text-sm font-medium uppercase tracking-widest text-[#C9A24B]">
                    {item.period}
                  </p>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-medium leading-snug text-[#EFE9DC] sm:text-xl">
                      {item.org}
                    </h4>
                    <p className="text-sm uppercase tracking-wider text-[#E8CD8A]/85">{item.role}</p>
                    {item.highlight && (
                      <p className="inline-flex w-fit items-center rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-4 py-1 text-xs font-medium tracking-wider text-[#E8CD8A]">
                        {item.highlight}
                      </p>
                    )}
                    <ul className="mt-1 flex flex-col gap-2.5">
                      {item.bullets.map((bullet, bi) => (
                        <li
                          key={`${bullet.lead}-${bi}`}
                          className="flex gap-3 text-sm font-light leading-relaxed text-[#EFE9DC]/60 sm:text-base"
                        >
                          <span className="mt-[2px] shrink-0 text-[#C9A24B]">—</span>
                          <span>
                            <span className="font-normal text-[#EFE9DC]/85">{bullet.lead}：</span>
                            {bullet.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
