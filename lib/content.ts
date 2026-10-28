import type { AboutStage, NavLink, ProcessStep, Stat } from "@/types/content";

export const SECTIONS = [
  { id: "hero", label: "A-01 Arrival" },
  { id: "about", label: "A-02 Studio" },
  { id: "work", label: "A-03 Projects" },
  { id: "services", label: "A-04 Services" },
  { id: "philosophy", label: "A-05 Philosophy" },
  { id: "process", label: "A-06 Process" },
  { id: "contact", label: "A-07 Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const navLinks: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const aboutStages: AboutStage[] = [
  {
    title: "Every remarkable space begins with an idea.",
    text: "A project starts as lines: a site, a brief, a set of questions. We draw the structure first and test it before anything else.",
  },
  {
    title: "Then walls, floors and light take shape.",
    text: "Structure, openings and materials are assembled layer by layer, so each decision can be seen and checked against the idea.",
  },
  {
    title: "We turn ideas into places that connect people.",
    text: "The finished building connects people, purpose, and place. That is the work we are here to do.",
  },
];

export const aboutSteps = ["01 Concept", "02 Design", "03 Reality"] as const;

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Discover", description: "Understanding the client's vision, the site and the brief." },
  { number: "02", title: "Conceptualize", description: "Developing the initial architectural concept and massing." },
  { number: "03", title: "Design", description: "Refining the floor plans, structure, materials and details." },
  { number: "04", title: "Visualize", description: "Presenting the proposed building through detailed visualizations." },
  { number: "05", title: "Deliver", description: "Preparing the final design deliverables and supporting the next stage of the project." },
];

export const stats: Stat[] = [
  { value: 12, label: "Years of practice" },
  { value: 64, label: "Projects designed" },
  { value: 9, label: "Cities" },
  { value: 23, label: "Design awards" },
];