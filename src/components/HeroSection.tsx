import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import { UI, type Lang } from '../i18n';

export default function HeroSection({ lang, onToggleLang }: { lang: Lang; onToggleLang: () => void }) {
  const s = UI[lang];
  const links = [
    { label: s.nav.about, href: '#about' },
    { label: s.nav.education, href: '#journey' },
    { label: s.nav.program, href: '#portfolio' },
    { label: s.nav.knowledge, href: '#knowledge' },
    { label: s.nav.subscribe, href: '#subscribe' },
  ];

  return (
    <section
      className="relative flex h-screen flex-col overflow-x-clip px-6 pb-7 pt-6 sm:pb-8 md:px-10 md:pb-10 md:pt-8"
      style={{ overflowX: 'clip' }}
    >
      {/* Navbar */}
      <FadeIn y={-20} delay={0}>
        <nav className="flex items-center justify-between gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wider text-[#EFE9DC] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onToggleLang}
            title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
            className="shrink-0 rounded-full border border-[#C9A24B]/50 px-3 py-1 text-xs font-medium tracking-widest text-[#E8CD8A] transition-colors duration-200 hover:border-[#C9A24B] hover:bg-[#C9A24B]/10 md:px-4 md:py-1.5 md:text-sm"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <div className="overflow-hidden">
        <FadeIn as="h1" delay={0.15} y={40} className="hero-heading mt-6 w-full whitespace-nowrap text-[13.5vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[14.5vw] md:-mt-5 md:text-[15vw] lg:text-[16vw]">
          Hi, i&apos;m Claire
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex items-end justify-between">
        <FadeIn y={20} delay={0.35}>
          <p
            className="max-w-[210px] font-light uppercase leading-snug tracking-wide text-[#EFE9DC] sm:max-w-[300px] md:max-w-[340px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            <span className="mb-2 block text-[0.7em] tracking-[0.3em] text-[#C9A24B]">
              {s.heroTaglineLabel}
            </span>
            {s.heroTagline}
          </p>
        </FadeIn>
        <FadeIn y={20} delay={0.5}>
          <ContactButton label={s.contact} href="#subscribe" />
        </FadeIn>
      </div>

      {/* Portrait — click to jump to About */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0">
        <FadeIn y={30} delay={0.6}>
          <a
            href="#about"
            aria-label={lang === 'zh' ? '点击照片，了解更多关于我' : 'Click the portrait to read more about me'}
            title={lang === 'zh' ? '点击进入 About' : 'Go to About'}
            className="group relative block"
          >
            <div className="absolute -inset-8 rounded-[48px] bg-[#C9A24B]/10 opacity-80 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
            <img
              src="portrait.jpg"
              alt="Claire 何珂一"
              draggable={false}
              className="relative w-[220px] rounded-[28px] object-cover shadow-[0_24px_90px_rgba(0,0,0,0.65)] ring-1 ring-[#C9A24B]/45 transition-transform duration-300 group-hover:scale-[1.02] sm:w-[270px] md:w-[330px] lg:w-[390px]"
            />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
