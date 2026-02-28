export type PortfolioBlockKey =
  | 'hero'
  | 'projects'
  | 'curriculo'
  | 'about'
  | 'activity'
  | 'experience'
  | 'skills'
  | 'githubProfile';

export interface PortfolioSocialLinks {
  github: string;
  linkedin: string;
  x: string;
  website: string;
  curriculum: string;
}

export interface PortfolioBlockConfig {
  enabled: boolean;
}

export interface PortfolioLayoutConfig {
  schemaVersion: number;
  socialLinks: PortfolioSocialLinks;
  blocks: Record<PortfolioBlockKey, PortfolioBlockConfig>;
  layoutOrder: PortfolioBlockKey[];
}

