import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EntryGate from './components/EntryGate';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import JourneySection from './components/JourneySection';
import ProjectsSection from './components/ProjectsSection';
import KnowledgeSection from './components/KnowledgeSection';
import SubscribeSection from './components/SubscribeSection';
import Footer from './components/Footer';
import { fetchPublished, loadLocal } from './content/store';
import type { SiteContent } from './content/types';
import type { Lang } from './i18n';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [lang, setLang] = useState<Lang>(() =>
    localStorage.getItem('claire-lang') === 'en' ? 'en' : 'zh'
  );
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    localStorage.setItem('claire-lang', lang);
  }, [lang]);

  useEffect(() => {
    const local = loadLocal();
    if (local) {
      setContent(local);
      return;
    }
    fetchPublished().then((c) => setContent(c));
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#EFE9DC]" style={{ overflowX: 'clip' }}>
      <AnimatePresence>
        {!entered && <EntryGate key="entry-gate" onEnter={() => setEntered(true)} />}
      </AnimatePresence>

      {content && entered && (
        <main>
          <HeroSection lang={lang} onToggleLang={() => setLang(lang === 'zh' ? 'en' : 'zh')} />
          <MarqueeSection />
          <AboutSection lang={lang} />
          <SkillsSection lang={lang} />
          <JourneySection lang={lang} groups={content.journey} />
          <ProjectsSection lang={lang} programs={content.programs} />
          <KnowledgeSection lang={lang} posts={content.knowledge} />
          <SubscribeSection lang={lang} />
          <Footer lang={lang} />
        </main>
      )}
    </div>
  );
}
