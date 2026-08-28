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

export default function App() {
  const [entered, setEntered] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);

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
          <HeroSection />
          <MarqueeSection />
          <AboutSection />
          <SkillsSection />
          <JourneySection groups={content.journey} />
          <ProjectsSection programs={content.programs} />
          <KnowledgeSection posts={content.knowledge} />
          <SubscribeSection />
          <Footer />
        </main>
      )}
    </div>
  );
}
