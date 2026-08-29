import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import {
  Award,
  BarChart3,
  Bot,
  Brain,
  Compass,
  Cpu,
  FileSearch,
  GraduationCap,
  Handshake,
  Lightbulb,
  LineChart,
  MessageSquare,
  PenTool,
  Rocket,
  Search,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ROW_ONE: { label: string; icon: LucideIcon }[] = [
  { label: 'Strategy', icon: Compass },
  { label: 'Data Stories', icon: BarChart3 },
  { label: 'AI Workflow', icon: Bot },
  { label: 'Market Insight', icon: Search },
  { label: 'Machine Learning', icon: Brain },
  { label: 'Python', icon: Terminal },
  { label: 'Econometrics', icon: LineChart },
  { label: 'User Growth', icon: TrendingUp },
  { label: 'GTM', icon: Rocket },
  { label: 'Industry DD', icon: FileSearch },
  { label: 'Business Model', icon: Target },
];

const ROW_TWO: { label: string; icon: LucideIcon }[] = [
  { label: 'Business Negotiation', icon: Handshake },
  { label: 'Product Design', icon: PenTool },
  { label: 'User Research', icon: Users },
  { label: 'Storytelling', icon: MessageSquare },
  { label: 'CDA Certified', icon: Award },
  { label: 'NTU', icon: GraduationCap },
  { label: 'Embodied AI', icon: Cpu },
  { label: 'Branding', icon: Sparkles },
  { label: 'Decision', icon: Lightbulb },
];

const DARK_GRADS = [
  'linear-gradient(135deg, #161209 0%, #241B0C 100%)',
  'linear-gradient(135deg, #0F0E0C 0%, #1D180E 100%)',
  'linear-gradient(135deg, #1E1810 0%, #3A2E14 100%)',
];
const GOLD_GRAD = 'linear-gradient(135deg, #D9BC6B 0%, #8C6F24 100%)';

function Tile({ label, icon: Icon, index }: { label: string; icon: LucideIcon; index: number }) {
  const isGold = index % 4 === 1;
  return (
    <div
      className="relative flex h-[270px] w-[420px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border"
      style={{
        background: isGold ? GOLD_GRAD : DARK_GRADS[index % DARK_GRADS.length],
        borderColor: isGold ? 'rgba(140,111,36,0.6)' : 'rgba(201,162,75,0.16)',
      }}
    >
      <span
        className="pointer-events-none absolute select-none font-black uppercase leading-none"
        style={{
          fontSize: '120px',
          color: isGold ? 'rgba(12,12,12,0.10)' : 'rgba(239,233,220,0.045)',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </span>
      <div className="relative flex flex-col items-center gap-5">
        <Icon
          size={56}
          strokeWidth={1}
          className={isGold ? 'text-[#241B0C]' : 'text-[#C9A24B]/85'}
        />
        <span
          className={`text-sm font-medium uppercase tracking-[0.35em] ${
            isGold ? 'text-[#241B0C]/85' : 'text-[#EFE9DC]/70'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function Row({ items, x }: { items: typeof ROW_ONE; x: MotionValue<number> }) {
  const tripled = [...items, ...items, ...items];
  return (
    <motion.div className="flex w-max gap-3" style={{ x, willChange: 'transform' }}>
      {tripled.map((tile, i) => (
        <Tile key={`${tile.label}-${i}`} label={tile.label} icon={tile.icon} index={i} />
      ))}
    </motion.div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const offset = useMotionValue(0);
  const x1 = useTransform(offset, (v) => v - 200);
  const x2 = useTransform(offset, (v) => -(v - 200));

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      offset.set((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return (
    <section ref={sectionRef} className="overflow-x-clip bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <Row items={ROW_ONE} x={x1} />
        <Row items={ROW_TWO} x={x2} />
      </div>
    </section>
  );
}
