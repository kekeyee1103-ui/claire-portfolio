import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import { UI, type Lang } from '../i18n';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACTS = [
  { icon: Linkedin, label: 'LinkedIn', value: 'Claire He', href: 'https://www.linkedin.com/in/claire-he-4442ba391/' },
  { icon: Mail, label: 'Email', value: 'kekeyee@outlook.com', href: 'mailto:kekeyee@outlook.com' },
  { icon: Phone, label: 'Phone', value: '182 0845 7205', href: 'tel:18208457205' },
  { icon: MapPin, label: 'Location', value: '新加坡 · 北京', href: undefined },
];

export default function SubscribeSection({ lang }: { lang: Lang }) {
  const s = UI[lang];
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError(lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <section
      id="subscribe"
      className="relative flex min-h-[90vh] items-center overflow-x-clip bg-[#0C0C0C] px-5 py-24 sm:px-8 sm:py-32 md:px-10"
      style={{ overflowX: 'clip' }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A24B] opacity-[0.07] blur-[130px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-10 text-center sm:gap-14">
        <FadeIn y={40}>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-[#C9A24B] sm:text-sm">
            {s.subscribeEyebrow}
          </p>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            {s.subscribeHeading}
          </h2>
          <p className="mt-6 font-light leading-relaxed text-[#EFE9DC]/65" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)' }}>
            {s.subscribeDesc}
          </p>
        </FadeIn>

        <div className="flex min-h-[76px] w-full items-start justify-center">
          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.85, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                >
                  <CheckCircle2 size={64} strokeWidth={1.2} className="text-[#C9A24B]" />
                </motion.div>
                <p className="text-xl font-medium text-[#EFE9DC] sm:text-2xl">{s.subscribeSuccess}</p>
                <p className="text-sm font-light text-[#EFE9DC]/55">
                  {s.subscribeSuccessNote}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="relative flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -12 }}
                noValidate
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="your@email.com"
                  aria-label="订阅邮箱"
                  className="w-full flex-1 rounded-full border-2 border-[#C9A24B]/40 bg-transparent px-6 py-3.5 text-sm font-light text-[#EFE9DC] outline-none transition-colors duration-300 placeholder:text-[#EFE9DC]/30 focus:border-[#C9A24B] sm:text-base"
                />
                <ContactButton label={s.subscribeBtn} type="submit" />
                {error && (
                  <p className="text-xs font-light tracking-wide text-[#E08A5C] sm:absolute sm:mt-24">
                    {error}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <FadeIn delay={0.15} className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {CONTACTS.map((c) => {
            const Inner = (
              <>
                <c.icon size={20} strokeWidth={1.3} className="text-[#C9A24B]" />
                <span className="text-sm font-light tracking-wider text-[#EFE9DC]/75 sm:text-base">
                  {c.value}
                </span>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-70"
              >
                {Inner}
              </a>
            ) : (
              <div key={c.label} className="flex items-center gap-3">
                {Inner}
              </div>
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}
