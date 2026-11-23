import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Journey } from './sections/Journey';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { useInitialHashScroll } from './hooks/useInitialHashScroll';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Cursor } from './components/Cursor';
import { IntroLoader } from './components/IntroLoader';

export default function App() {
  useSmoothScroll();
  useInitialHashScroll();

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-[10px] bg-accent px-4 py-2 font-medium text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <IntroLoader />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
