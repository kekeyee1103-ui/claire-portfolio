import { ArrowRight, NotebookPen } from 'lucide-react';
import FadeIn from './FadeIn';
import type { KnowledgePost } from '../content/types';
import { UI, type Lang } from '../i18n';

function PostCard({ post, index, readMore }: { post: KnowledgePost; index: number; readMore: string }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3.5 py-1 text-[11px] font-medium tracking-[0.2em] text-[#E8CD8A]">
          {post.tag}
        </span>
        <span className="text-xs font-light tracking-widest text-[#EFE9DC]/40">{post.date}</span>
      </div>
      <h3 className="mt-5 text-lg font-medium leading-snug text-[#EFE9DC] sm:text-xl">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-[#EFE9DC]/60">
        {post.excerpt}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[#C9A24B]">
        {readMore}
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </>
  );

  const cls =
    'group flex h-full flex-col rounded-[24px] border border-[#C9A24B]/25 bg-gradient-to-b from-[#15110A] to-[#0F0D09] p-7 text-left transition-colors duration-300 hover:border-[#C9A24B]/60 sm:p-8';

  return (
    <FadeIn delay={index * 0.1} className="h-full">
      {post.link ? (
        <a href={post.link} target="_blank" rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </FadeIn>
  );
}

export default function KnowledgeSection({ lang, posts }: { lang: Lang; posts: KnowledgePost[] }) {
  const s = UI[lang];

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

      <div className="mx-auto mt-14 max-w-6xl sm:mt-20">
        {posts.length === 0 ? (
          <FadeIn>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 rounded-[28px] border border-dashed border-[#C9A24B]/35 text-center">
              <NotebookPen size={34} strokeWidth={1.1} className="text-[#C9A24B]/80" />
              <p className="text-base font-medium tracking-[0.2em] text-[#EFE9DC]/75">{s.knowledgeEmpty}</p>
              <p className="text-sm font-light leading-relaxed text-[#EFE9DC]/45">{s.knowledgeEmptySub}</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={`${post.title}-${i}`} post={post} index={i} readMore={s.readMore} />
            ))}
            <FadeIn delay={posts.length * 0.1} className="h-full">
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-[#C9A24B]/35 p-8 text-center">
                <NotebookPen size={30} strokeWidth={1.2} className="text-[#C9A24B]/80" />
                <p className="text-sm font-light leading-relaxed text-[#EFE9DC]/55">{s.knowledgeMore}</p>
              </div>
            </FadeIn>
          </div>
        )}
      </div>
    </section>
  );
}
