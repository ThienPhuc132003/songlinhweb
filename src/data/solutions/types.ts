export interface SolutionCapability {
  icon: string;
  title: string;
  description: string;
}

export interface SolutionSpec {
  label: string;
  value: string;
  category?: string;
}

export interface SolutionArchitecture {
  title: string;
  description: string;
  diagramUrl?: string;
  integrations: string[];
}

export interface SolutionData {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  heroImage: string;
  description: string;
  capabilities: SolutionCapability[];
  architecture: SolutionArchitecture;
  specs: SolutionSpec[];
  brands: string[];
  relatedProjectSlugs: string[];
  metaTitle?: string;
  metaDescription?: string;
}
