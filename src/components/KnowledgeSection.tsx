import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, NotebookPen, X } from 'lucide-react';
import FadeIn from './FadeIn';
import type { KnowledgePost } from '../content/types';
import { UI, type Lang } from '../i18n';

function PostCard({
  post,
  index,
  readMore,
  onOpen,
}: {
  post: KnowledgePost;
  index: number;
  readMore: string;
  onOpen: () => void;
}) {
  const cls =
    'group flex h-full cursor-pointer flex-col rounded-[20px] border border-[#C9A24B]/25 bg-gradient-to-b from-[#15110A] to-[#0F0D09] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/60 sm:p-6';

  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-0.5 text-[10px] font-medium tracking-[0.2em] text-[#E8CD8A]">
          {post.tag}
        </span>
        <span className="text-[11px] font-light tracking-widest text-[#EFE9DC]/40">{post.date}</span>
      </div>
      <h3 className="mt-3.5 line-clamp-2 text-base font-medium leading-snug text-[#EFE9DC] sm:text-lg">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[13px] font-light leading-relaxed text-[#EFE9DC]/55">
        {post.excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A24B]">
        {readMore}
        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </>
  );

  return (
    <FadeIn delay={index * 0.08} className="h-full">
      <div className={cls} onClick={onOpen} role="button" aria-label={`查看：${post.title}`}>
        {inner}
      </div>
    </FadeIn>
  );
}

function PostModal({
  post,
  closeLabel,
  onClose,
}: {
  post: KnowledgePost;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="relative my-auto w-full max-w-2xl rounded-[24px] border-2 border-[#C9A24B]/50 bg-[#0F0D09] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.7)] sm:p-9"
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-4 top-4 rounded-full border border-[#C9A24B]/30 p-2 text-[#EFE9DC]/60 transition-colors hover:border-[#C9A24B] hover:text-[#C9A24B]"
        >
          <X size={16} />
        </button>

        <div className="flex flex-wrap items-center gap-3 pr-10">
          <span className="rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3.5 py-1 text-[11px] font-medium tracking-[0.2em] text-[#E8CD8A]">
            {post.tag}
          </span>
          <span className="text-xs font-light tracking-widest text-[#EFE9DC]/40">{post.date}</span>
        </div>

        <h3 className="mt-4 text-xl font-medium leading-snug text-[#EFE9DC] sm:text-2xl">
          {post.title}
        </h3>
        <span className="mt-4 block h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(201,162,75,0.45), transparent)' }} />

        <div className="mt-5 whitespace-pre-line text-sm font-light leading-loose text-[#EFE9DC]/70 sm:text-base">
          {post.content || post.excerpt}
        </div>

        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#C9A24B]/70 px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-[#EFE9DC] transition-colors duration-300 hover:bg-[#C9A24B]/10"
          >
            {post.link.includes('github') ? 'Source' : '原文链接'}
            <ArrowRight size={14} />
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function KnowledgeSection({ lang, posts }: { lang: Lang; posts: KnowledgePost[] }) {
  const s = UI[lang];
  const [activeTag, setActiveTag] = useState<string>('__all__');
  const [selected, setSelected] = useState<KnowledgePost | null>(null);

  const tags = useMemo(() => {
    const set: string[] = [];
    for (const p of posts) {
      if (p.tag && !set.includes(p.tag)) set.push(p.tag);
    }
    return set;
  }, [posts]);

  const filtered = activeTag === '__all__' ? posts : posts.filter((p) => p.tag === activeTag);

  return (
    <section
      id="knowledge"
      className="relative overflow-x-clip bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
      style={{ overflowX: 'clip' }}
    >
      <div className="pointer-events-none absolute right-0 top-10 h-[280px] w-[40%] rounded-full bg-[#C9A24B] opacity-[0.05] blur-[110px]" />

      <FadeIn y={40}>
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.4em] text-[#C9A24B] sm:text-sm">
          {s.knowledgeEyebrow}
        </p>
        <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {s.knowledgeHeading}
        </h2>
        <p className="mt-6 text-center font-light leading-relaxed text-[#EFE9DC]/65" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)' }}>
          {s.knowledgeSub}
        </p>
      </FadeIn>

      <div className="mx-auto mt-12 max-w-6xl sm:mt-16">
        {posts.length === 0 ? (
          <FadeIn>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 rounded-[28px] border border-dashed border-[#C9A24B]/35 text-center">
              <NotebookPen size={34} strokeWidth={1.1} className="text-[#C9A24B]/80" />
              <p className="text-base font-medium tracking-[0.2em] text-[#EFE9DC]/75">{s.knowledgeEmpty}</p>
              <p className="text-sm font-light leading-relaxed text-[#EFE9DC]/45">{s.knowledgeEmptySub}</p>
            </div>
          </FadeIn>
        ) : (
          <>
            {tags.length > 0 && (
              <FadeIn className="mb-8 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTag('__all__')}
                  className={`rounded-full border px-5 py-1.5 text-xs font-medium tracking-wider transition-colors duration-200 ${
                    activeTag === '__all__'
                      ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0C0C0C]'
                      : 'border-[#C9A24B]/35 text-[#EFE9DC]/70 hover:border-[#C9A24B]'
                  }`}
                >
                  {s.filterAll}
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={`rounded-full border px-5 py-1.5 text-xs font-medium tracking-wider transition-colors duration-200 ${
                      activeTag === tag
                        ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0C0C0C]'
                        : 'border-[#C9A24B]/35 text-[#EFE9DC]/70 hover:border-[#C9A24B]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </FadeIn>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <PostCard
                  key={`${post.title}-${i}`}
                  post={post}
                  index={i}
                  readMore={s.readMore}
                  onOpen={() => setSelected(post)}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="mt-6 text-center text-sm font-light text-[#EFE9DC]/45">{s.knowledgeEmpty}</p>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <PostModal post={selected} closeLabel={s.close} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
