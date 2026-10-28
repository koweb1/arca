import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollReadout from "@/components/layout/ScrollReadout";
import SceneLoader from "@/components/scene/SceneLoader";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import JsonLd from "@/components/ui/JsonLd";
import { projectsJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] bg-blue px-4 py-3 font-bold text-[#06161c] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <SceneLoader />
      <Navbar />
      <ScrollReadout />
      <main id="main" tabIndex={-1} className="relative z-[1]">
        <Hero />
        <About />
        <Projects />
        <Services />
        <Philosophy />
        <Process />
        <Contact />
      </main>
      <Footer />
      <JsonLd data={projectsJsonLd} />
    </>
  );
}