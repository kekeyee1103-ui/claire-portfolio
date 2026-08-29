import { Blocks, Moon, Orbit, Shapes } from 'lucide-react';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';
import { UI, type Lang } from '../i18n';

const CHIPS = ['战略分析', '行业研究', '数据建模', 'AI 工具应用', '商务谈判'];

const DECOR_STYLES = { filter: 'drop-shadow(0 0 26px rgba(201,162,75,0.35))' };

export default function AboutSection({ lang }: { lang: Lang }) {
  const s = UI[lang];

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip px-5 py-20 sm:px-8 md:px-10"
      style={{ overflowX: 'clip' }}
    >
      {/* decorative corners */}
      <FadeIn
        x={-80}
        y={0}
        delay={0.1}
        duration={0.9}
        className="absolute left-[1%] top-[4%] sm:left-[2%] md:left-[4%]"
      >
        <Moon className="w-[100px] text-[#C9A24B]/85 sm:w-[150px] md:w-[200px]" strokeWidth={0.8} style={DECOR_STYLES} />
      </FadeIn>
      <FadeIn
        x={-80}
        y={0}
        delay={0.25}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]"
      >
        <Shapes className="w-[90px] text-[#C9A24B]/70 sm:w-[130px] md:w-[170px]" strokeWidth={0.8} style={DECOR_STYLES} />
      </FadeIn>
      <FadeIn
        x={80}
        y={0}
        delay={0.15}
        duration={0.9}
        className="absolute right-[1%] top-[4%] sm:right-[2%] md:right-[4%]"
      >
        <Blocks className="w-[100px] text-[#C9A24B]/85 sm:w-[150px] md:w-[200px]" strokeWidth={0.8} style={DECOR_STYLES} />
      </FadeIn>
      <FadeIn
        x={80}
        y={0}
        delay={0.3}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]"
      >
        <Orbit className="w-[100px] text-[#C9A24B]/70 sm:w-[150px] md:w-[190px]" strokeWidth={0.8} style={DECOR_STYLES} />
      </FadeIn>

      <div className="z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn as="h2" y={40} className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {s.aboutHeading}
        </FadeIn>

        <div className="flex flex-col items-center gap-12 sm:gap-16 md:gap-20">
          <AnimatedText
            text={s.aboutText}
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#EFE9DC]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />

          <div className="flex max-w-[560px] flex-wrap items-center justify-center gap-3">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#C9A24B]/40 px-4 py-1.5 text-xs font-light tracking-wider text-[#EFE9DC]/75 sm:text-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <FadeIn y={20} delay={0.1}>
            <ContactButton label={s.contact} href="#subscribe" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
