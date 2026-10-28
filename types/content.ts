export interface NavLink {
  label: string;
  href: string;
}

export interface Project {
  name: string;
  category: string;
  location: string;
  year: string;
  area: string;
  description: string;
}

export interface Service {
  title: string;
  tag: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface AboutStage {
  title: string;
  text: string;
}

export interface Stat {
  value: number;
  label: string;
}