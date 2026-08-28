import type { CSSProperties } from 'react';

interface ContactButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function ContactButton({
  label = 'Contact Me',
  href,
  onClick,
  className = '',
  type = 'button',
}: ContactButtonProps) {
  const cls = `inline-block rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-[#2A2109] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap ${className}`;
  const style: CSSProperties = {
    background: 'linear-gradient(123deg, #FFFFFF 7%, #F7ECD2 37%, #E9D5A2 72%, #C9A24B 100%)',
    boxShadow:
      '0px 4px 4px rgba(201, 162, 75, 0.30), 4px 4px 12px rgba(140, 111, 36, 0.28) inset',
    outline: '2px solid #FFFFFF',
    outlineOffset: '-3px',
  };

  if (href) {
    return (
      <a href={href} className={cls} style={style}>
        {label}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} style={style}>
      {label}
    </button>
  );
}
