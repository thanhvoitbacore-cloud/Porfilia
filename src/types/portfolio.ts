export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatarUrl?: string;
}

export interface HeroMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  iconName?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  impactMetric?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  details?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  heroMetrics: HeroMetric[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  education: EducationItem[];
  awards: AwardItem[];
  industry: string;
  targetRole: string;
}

export type StylePreset = 'bento' | 'editorial' | 'minimal' | 'cyber' | 'executive';

export interface DesignToken {
  preset: StylePreset;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
  fontTitle: string;
  fontBody: string;
  borderRadius: string;
  gridCols: string;
}

export interface VibeProposal {
  id: string;
  name: string;
  tagline: string;
  description: string;
  preset: StylePreset;
  designToken: DesignToken;
  visualDnaExplanation: string;
  recommendedFor: string;
}

export type AgentMode = 'guided' | 'freeform';

export interface ProviderConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: AgentMode;
}

export interface PortfolioState {
  version: string;
  updatedAt: string;
  data: PortfolioData;
  selectedVibe: VibeProposal | null;
  designToken: DesignToken;
  agentMode: AgentMode;
  customConfig: ProviderConfig;
  currentStep: number;
}
