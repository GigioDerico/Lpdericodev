import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { TechStack } from "./components/TechStack";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { Differentiators } from "./components/Differentiators";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <TechStack />
        <Projects />
        <Testimonials />
        <Differentiators />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
