import { motion } from 'framer-motion';

interface EntryGateProps {
  onEnter: () => void;
}

export default function EntryGate({ onEnter }: EntryGateProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center overflow-hidden bg-[#0C0C0C]"
      onClick={onEnter}
      role="button"
      aria-label="点击进入主页"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* ambient gold glows */}
      <div className="pointer-events-none absolute -left-24 top-[8%] h-[420px] w-[420px] rounded-full bg-[#C9A24B] opacity-[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-[8%] h-[420px] w-[420px] rounded-full bg-[#E8CD8A] opacity-[0.06] blur-[120px]" />

      <motion.p
        className="relative z-10 text-sm font-medium uppercase tracking-[0.5em] text-[#E8CD8A] sm:text-base"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        Claire
      </motion.p>

      <motion.div
        className="relative z-10 mt-6"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.08, y: -32 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="absolute -inset-6 rounded-[36px] bg-[#C9A24B]/10 blur-2xl" />
        <img
          src="portrait.jpg"
          alt="Claire 何珂一"
          draggable={false}
          className="relative w-[250px] rounded-[26px] object-cover shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-[#C9A24B]/50 sm:w-[310px]"
        />
      </motion.div>

      <motion.p
        className="relative z-10 mt-8 text-sm tracking-[0.45em] text-[#EFE9DC]/85"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        何珂一
      </motion.p>

      <motion.p
        className="relative z-10 mt-5 animate-pulse text-[11px] uppercase tracking-[0.3em] text-[#EFE9DC]/50 sm:text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
      >
        点击进入 · Click to Enter
      </motion.p>
    </motion.div>
  );
}
