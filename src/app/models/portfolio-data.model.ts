import { PortfolioBlockKey } from './portfolio-layout.model';

export type PortfolioSourceMode = 'api' | 'manual';

export interface PortfolioProject {
  id: string;
  title: string;
  img: string;
  sobre: string;
  tecnologia: string;
  git?: string;
  link?: string;
}

export interface PortfolioHeroData {
  introPrefix: string;
  typingNames: string[];
  subtitleOne: string;
  subtitleTwo: string;
  primaryStack: string;
  aboutRotator: string[];
  heroAboutTitle: string;
  heroAboutDescription: string;
  contacts: Array<{
    label: string;
    url: string;
    icon: string;
    iconType: 'emoji' | 'image';
  }>;
}

export interface PortfolioProfileData {
  name: string;
  handle: string;
  bio: string;
  professionalLabel: string;
  followers: number;
  following: number;
  company: string;
  companyUrl: string;
  location: string;
  timezone: string;
  website: string;
  x: string;
  linkedinUser: string;
  linkedinPath: string;
  avatarUrl?: string;
}

export interface PortfolioAboutCardData {
  badge: string;
  title: string;
  summary: string;
  pillars: Array<{ title: string; description: string }>;
  highlights: Array<{ label: string; value: string }>;
  timeline: Array<{ period: string; text: string }>;
}

export interface PortfolioLinkedinData {
  headline: string;
  about: string;
  activity: string;
  experience: string;
}

export interface PortfolioCurriculumData {
  title: string;
  description: string;
  url: string;
}

export interface PortfolioSkillCategory {
  name: string;
  items: string[];
}

export interface PortfolioExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  technologies: string[];
}

export interface PortfolioCaseStudy {
  title: string;
  summary: string;
  decisions: string[];
}

export interface PortfolioCertification {
  name: string;
  issuer: string;
  year: string;
  link?: string;
}

export interface PortfolioContactData {
  email: string;
  github: string;
  linkedin: string;
  phone?: string;
  formEnabled: boolean;
}

export interface PortfolioCustomCardField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'url' | 'image';
}

export interface PortfolioDocument {
  schemaVersion: number;
  username: string;
  sourceMode: PortfolioSourceMode;
  updatedAt: string;
  socialLinks: {
    github: string;
    linkedin: string;
    x: string;
    website: string;
    curriculum: string;
  };
  blocks: Record<PortfolioBlockKey, { enabled: boolean }>;
  layoutOrder: PortfolioBlockKey[];
  hero: PortfolioHeroData;
  profile: PortfolioProfileData;
  aboutCard: PortfolioAboutCardData;
  linkedin: PortfolioLinkedinData;
  curriculum: PortfolioCurriculumData;
  projects: {
    title: string;
    subtitle: string;
    items: PortfolioProject[];
  };
  skills: PortfolioSkillCategory[];
  experience: PortfolioExperienceEntry[];
  caseStudies: PortfolioCaseStudy[];
  certifications: PortfolioCertification[];
  contact: PortfolioContactData;
  customCardFields?: Record<string, PortfolioCustomCardField[]>;
}
