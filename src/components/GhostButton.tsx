import { ArrowUpRight } from 'lucide-react';

interface GhostButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export default function GhostButton({ label = 'View Case', href, className = '' }: GhostButtonProps) {
  const cls = `inline-flex items-center gap-2 rounded-full border-2 border-[#C9A24B]/70 px-8 py-3 text-xs sm:px-10 sm:py-3.5 sm:text-sm font-medium uppercase tracking-widest text-[#EFE9DC] transition-colors duration-300 hover:bg-[#C9A24B]/10 whitespace-nowrap ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {label}
        <ArrowUpRight size={16} />
      </a>
    );
  }
  return (
    <span className={cls}>
      {label}
      <ArrowUpRight size={16} />
    </span>
  );
}
