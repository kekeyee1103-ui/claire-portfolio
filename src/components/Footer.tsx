import { UI, type Lang } from '../i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const s = UI[lang];
  return (
    <footer className="border-t border-[#C9A24B]/15 bg-[#0C0C0C] px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-sm font-light tracking-wider text-[#EFE9DC]/55">
          © 2026 Claire He · 何珂一
          <a
            href="admin.html"
            className="ml-3 text-xs text-[#EFE9DC]/30 transition-colors duration-200 hover:text-[#C9A24B]"
          >
            内容管理
          </a>
        </p>
        <p className="text-xs font-light uppercase tracking-[0.25em] text-[#C9A24B]/60">
          {s.footerTagline}
        </p>
        <a
          href="#about"
          className="text-xs font-medium uppercase tracking-[0.25em] text-[#EFE9DC]/60 transition-colors duration-200 hover:text-[#C9A24B]"
        >
          {s.backToTop}
        </a>
      </div>
    </footer>
  );
}
