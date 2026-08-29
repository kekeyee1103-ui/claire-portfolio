export interface Bullet {
  lead: string;
  text: string;
}

export interface JourneyItem {
  period: string;
  org: string;
  role: string;
  highlight?: string;
  bullets: Bullet[];
}

export type JourneyIconKey = 'edu' | 'trophy' | 'briefcase';

export interface JourneyGroup {
  titleCn: string;
  iconKey: JourneyIconKey;
  items: JourneyItem[];
}

export interface Program {
  name: string;
  categoryEn: string;
  categoryCn: string;
  desc: string;
  url?: string;
  art?: string;
}

export interface KnowledgePost {
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  content?: string;
  link?: string;
}

export interface SiteContent {
  journey: JourneyGroup[];
  programs: Program[];
  knowledge: KnowledgePost[];
}
