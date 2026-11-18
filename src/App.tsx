import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore, type ChapterId } from './store/usePortfolioStore';
import {
  computeHallwayScrollProgress,
  shouldAutostartFromSearch,
} from './utils/portfolioLogic';
import { setAmbientMusicActive } from './utils/soundEffects';
import { MangaNavigation } from './components/manga/MangaNavigation';
import { InkTransition } from './components/manga/InkTransition';
import { Stage3DDock } from './components/manga/Stage3DDock';
import { DraggablePanel } from './components/manga/DraggablePanel';
import { PortfolioWorldCanvas } from './components/three/PortfolioWorldCanvas';
import { Chapter00Intro } from './components/chapters/Chapter00Intro';
import { Chapter01Home } from './components/chapters/Chapter01Home';
import { Chapter02About } from './components/chapters/Chapter02About';
import { Chapter03Skills } from './components/chapters/Chapter03Skills';
import { Chapter04Projects } from './components/chapters/Chapter04Projects';
import { Chapter05Timeline } from './components/chapters/Chapter05Timeline';
import { Chapter06Contact } from './components/chapters/Chapter06Contact';
import { ProjectEpisodeModal } from './components/chapters/ProjectEpisodeModal';
import { SeoHead } from './components/SeoHead';
import { personalData } from './data/personal';

gsap.registerPlugin(ScrollTrigger);

const ROUTE_TO_CHAPTER: Record<string, ChapterId> = {
  '/': 'home',
  '/about': 'about',
  '/skills': 'skills',
  '/projects': 'projects',
  '/timeline': 'timeline',
  '/contact': 'contact',
};

const CHAPTER_TO_ROUTE: Record<string, string> = {
  home: '/',
  about: '/about',
  skills: '/skills',
  projects: '/projects',
  timeline: '/timeline',
  contact: '/contact',
};

function PortfolioShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const introCompleted = usePortfolioStore((s) => s.introCompleted);
  const completeIntro = usePortfolioStore((s) => s.completeIntro);
  const reopenIntro = usePortfolioStore((s) => s.reopenIntro);
  const activeChapter = usePortfolioStore((s) => s.activeChapter);
  const setActiveChapter = usePortfolioStore((s) => s.setActiveChapter);
  const transitionActive = usePortfolioStore((s) => s.transitionActive);
  const setTransitionActive = usePortfolioStore((s) => s.setTransitionActive);
  const explore3DMode = usePortfolioStore((s) => s.explore3DMode);
  const bgmEnabled = usePortfolioStore((s) => s.bgmEnabled);
  const setBgmEnabled = usePortfolioStore((s) => s.setBgmEnabled);

  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Sync ambient twilight soundtrack with store state
  useEffect(() => {
    setAmbientMusicActive(bgmEnabled);
  }, [bgmEnabled]);

  useEffect(() => {
    return () => {
      setAmbientMusicActive(false);
    };
  }, []);

  // Skip intro automatically if ?autostart=1 or direct deep subroute is visited
  useEffect(() => {
    const autostart = shouldAutostartFromSearch(location.search);
    const isDirectSubroute =
      location.pathname !== '/' && Boolean(ROUTE_TO_CHAPTER[location.pathname]);
    if (autostart || isDirectSubroute) {
      completeIntro();
    }
  }, [location.search, location.pathname, completeIntro]);

  // Scroll to target chapter when navigating via route
  useEffect(() => {
    if (!introCompleted) return;
    const chapter = ROUTE_TO_CHAPTER[location.pathname];
    if (!chapter) return;

    setActiveChapter(chapter);
    const timer = window.setTimeout(() => {
      if (chapter === 'home') {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        return;
      }
      const target = document.getElementById(chapter);
      if (target) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: -64 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [introCompleted, location.pathname, setActiveChapter]);

  // Lenis smooth scroll + GSAP ScrollTrigger active chapter tracking
  useEffect(() => {
    if (!introCompleted) {
      setScrollProgress(0);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', () => {
        ScrollTrigger.update();
        const prog = computeHallwayScrollProgress(
          window.scrollY,
          document.documentElement.scrollHeight,
          window.innerHeight,
        );
        setScrollProgress(prog);
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const onNativeScroll = () => {
      const prog = computeHallwayScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      setScrollProgress(prog);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    const chapters: ChapterId[] = [
      'home',
      'about',
      'skills',
      'projects',
      'timeline',
      'contact',
    ];
    const triggers = chapters
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveChapter(id),
          onEnterBack: () => setActiveChapter(id),
        });
      })
      .filter((t): t is ScrollTrigger => t !== null);

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onNativeScroll);
      triggers.forEach((t) => t.kill());
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [introCompleted, setActiveChapter]);

  const handleEnterPortfolio = useCallback(() => {
    setBgmEnabled(true);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      completeIntro();
      return;
    }
    setTransitionActive(true);
    window.setTimeout(() => {
      completeIntro();
      window.scrollTo({ top: 0, behavior: 'auto' });
      window.setTimeout(() => {
        setTransitionActive(false);
      }, 240);
    }, 220);
  }, [completeIntro, setBgmEnabled, setTransitionActive]);

  const handleReplayIntro = useCallback(() => {
    reopenIntro();
    if (location.pathname !== '/' || location.search) {
      navigate('/', { replace: true });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [reopenIntro, location.pathname, location.search, navigate]);

  const handleNavigateChapter = useCallback(
    (chapterId: string) => {
      if (
        chapterId === 'home' ||
        chapterId === 'about' ||
        chapterId === 'skills' ||
        chapterId === 'projects' ||
        chapterId === 'timeline' ||
        chapterId === 'contact'
      ) {
        setActiveChapter(chapterId);
      }
      const targetRoute = CHAPTER_TO_ROUTE[chapterId] ?? '/';
      if (location.pathname !== targetRoute) {
        navigate(targetRoute);
      } else if (chapterId === 'home') {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        const el = document.getElementById(chapterId);
        if (el) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el, { offset: -64 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    },
    [location.pathname, navigate, setActiveChapter],
  );

  const pageTitle =
    activeChapter === 'home' || !introCompleted
      ? 'Basiturraza Taji — 3D Manga Developer Portfolio'
      : `${activeChapter.charAt(0).toUpperCase() + activeChapter.slice(1)} · Basiturraza Taji Portfolio`;

  return (
    <div className="relative min-h-screen bg-[#271522] text-[#211E25]">
      <SeoHead
        title={pageTitle}
        description="Interactive 3D anime manga developer portfolio of Basiturraza Taji, Bachelor of Computer Applications graduate (RTMNU, 2026)."
      />

      {/* Persistent Full-Site Interactive 3D Three.js World */}
      <PortfolioWorldCanvas scrollProgress={scrollProgress} />

      <InkTransition
        active={transitionActive}
        label="Chapter 01 · Opening Spread"
      />

      {!introCompleted ? (
        <main id="main-content" data-state="intro" className="relative z-10 pointer-events-none">
          <Chapter00Intro onEnter={handleEnterPortfolio} />
        </main>
      ) : (
        <div
          className="relative z-10 min-h-screen pointer-events-none"
          data-state={explore3DMode ? 'explore-3d' : 'portfolio'}
        >
          <div className="pointer-events-auto sticky top-0 z-40">
            <MangaNavigation
              activeChapter={activeChapter}
              onNavigateChapter={handleNavigateChapter}
            />
          </div>

          <main id="main-content" className="pointer-events-none">
            <Chapter01Home
              onNavigateChapter={handleNavigateChapter}
              onReplayIntro={handleReplayIntro}
            />

            <Chapter02About />

            <Chapter03Skills />

            {/* Scenic Open 3D Corridor Break */}
            <aside
              aria-label="Open 3D corridor vista"
              className={`pointer-events-none flex h-44 items-end justify-center px-5 pb-6 sm:h-56 ${
                explore3DMode ? 'invisible opacity-0' : 'opacity-100'
              }`}
            >
              <DraggablePanel className="pointer-events-auto" label="Corridor Perspective Banner">
                <div className="border-2 border-[#E8BFC9] bg-[#211E25]/92 px-5 py-2.5 text-center text-[#FFF9F1] shadow-[4px_4px_0_#B84955]">
                  <p className="font-mono-tabular text-[11px] tracking-[0.16em] text-[#E8BFC9]">
                    3D CORRIDOR PERSPECTIVE · SCROLL OR DRAG PANELS ASIDE
                  </p>
                </div>
              </DraggablePanel>
            </aside>

            <Chapter04Projects />

            <Chapter05Timeline />

            <Chapter06Contact />
          </main>

          <footer
            className={`pointer-events-auto relative z-10 border-t-2 border-[#E8BFC9]/35 bg-[#211E25] px-5 pt-8 pb-28 text-[#E8BFC9] sm:px-8 sm:pb-32 ${
              explore3DMode ? 'invisible opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-bold text-[#FFF9F1]">
                  {personalData.name}
                </p>
                <p className="text-xs text-[#E8BFC9]">
                  Bachelor of Computer Applications · RTMNU 2026 · Software Developer Portfolio
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs">
                <button
                  type="button"
                  onClick={handleReplayIntro}
                  className="underline decoration-[#B84955] underline-offset-4 hover:text-[#FFF9F1] cursor-pointer"
                >
                  Chapter 00 Intro
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateChapter('home')}
                  className="underline decoration-[#B84955] underline-offset-4 hover:text-[#FFF9F1] cursor-pointer"
                >
                  Back to Top
                </button>
              </div>
            </div>
          </footer>

          <ProjectEpisodeModal />
        </div>
      )}

      <Stage3DDock onNavigateChapter={handleNavigateChapter} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioShell />} />
        <Route path="/about" element={<PortfolioShell />} />
        <Route path="/skills" element={<PortfolioShell />} />
        <Route path="/projects" element={<PortfolioShell />} />
        <Route path="/timeline" element={<PortfolioShell />} />
        <Route path="/contact" element={<PortfolioShell />} />
        <Route path="*" element={<PortfolioShell />} />
      </Routes>
    </BrowserRouter>
  );
}
