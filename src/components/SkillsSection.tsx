import FadeIn from './FadeIn';

const SKILLS = [
  {
    name: '战略与行业分析',
    en: 'Strategy & Industry Analysis',
    desc: '运用 S-Curve、PESTEL、红蓝海（ERRC）等框架开展行业研判与商业模式分析，输出可落地的战略建议。',
  },
  {
    name: '市场与用户研究',
    en: 'Market & User Research',
    desc: '主导问卷设计、深度访谈与圆桌策划，将定性洞察转化为定量需求文档与增长策略。',
  },
  {
    name: '数据建模与分析',
    en: 'Data Modeling & Analytics',
    desc: '熟练使用 Python、SQL、SPSS 与机器学习方法，完成数据清洗、假设检验与商业预测建模。',
  },
  {
    name: 'AI 工具应用',
    en: 'AI-Augmented Workflow',
    desc: '深度使用 Claude Code、Codex 等 AI 工具，高效完成尽调建库、MVP 方案与商业计划书产出。',
  },
  {
    name: '商务沟通与谈判',
    en: 'Business Communication',
    desc: '具备国际化沟通与商务推进能力，英语可作为工作语言（IELTS 6.5），擅长跨文化协作与价格谈判。',
  },
];

const CHIPS = [
  'Python',
  'SQL',
  'SPSS',
  '机器学习',
  '数据分析',
  '行业研究',
  '商业模式分析',
  'CDA Level I & II',
  'IELTS 6.5',
  'CET-6',
];

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative z-0 rounded-t-[40px] bg-[#F7F3E8] px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.4em] text-[#8C6F24] sm:text-sm">
          What I Do
        </p>
        <h2 className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Skills
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {SKILLS.map((skill, i) => (
          <FadeIn
            key={skill.name}
            delay={i * 0.1}
            className="flex items-center gap-6 border-b py-8 sm:gap-10 sm:py-10 md:py-12"
            style={{ borderColor: 'rgba(140,111,36,0.25)' }}
          >
            <span className="gold-heading shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {skill.name}
                <span className="ml-3 hidden text-sm font-light tracking-[0.25em] text-[#8C6F24] lg:inline">
                  {skill.en}
                </span>
              </h3>
              <p className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]/60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                {skill.desc}
              </p>
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={0.2} className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-16">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-[#8C6F24]/35 bg-white/60 px-4 py-1.5 text-xs font-normal tracking-wider text-[#0C0C0C]/70 sm:text-sm"
            >
              {chip}
            </span>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
