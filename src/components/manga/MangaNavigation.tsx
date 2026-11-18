import { useState } from 'react';
import { Menu, Music, VolumeX, X } from 'lucide-react';
import { personalData } from '../../data/personal';
import { usePortfolioStore } from '../../store/usePortfolioStore';

interface MangaNavigationProps {
  onNavigateChapter: (chapterId: string) => void;
  activeChapter: string;
}

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'timeline', label: 'Storyline' },
];

export function MangaNavigation({
  onNavigateChapter,
  activeChapter,
}: MangaNavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const bgmEnabled = usePortfolioStore((s) => s.bgmEnabled);
  const toggleBgm = usePortfolioStore((s) => s.toggleBgm);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigateChapter(id);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#211E25] bg-[#FFF9F1]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Single-line Brand wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="font-display text-lg font-bold tracking-tight text-[#211E25] whitespace-nowrap shrink-0 hover:text-[#632D40] transition-colors"
        >
          {personalData.shortBrand}
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary chapters"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#301B29]"
        >
          {navItems.map((item) => {
            const isActive = activeChapter === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#B84955] ${
                  isActive ? 'font-semibold text-[#B84955]' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#B84955]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Music toggle + Contact primary action + mobile drawer trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleBgm}
            aria-pressed={bgmEnabled}
            aria-label={bgmEnabled ? 'Mute ambient music' : 'Play ambient music'}
            className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 border-2 border-[#211E25] px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              bgmEnabled
                ? 'bg-[#B84955] text-[#FFF9F1] shadow-[2px_2px_0_#211E25]'
                : 'bg-[#F6EBDD] text-[#211E25] hover:bg-[#E8BFC9]'
            }`}
          >
            {bgmEnabled ? (
              <Music className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{bgmEnabled ? 'Music On' : 'Music'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="hidden sm:inline-flex min-h-[40px] items-center justify-center border-2 border-[#211E25] bg-[#632D40] px-4 py-2 text-xs font-semibold text-[#FFF9F1] shadow-[3px_3px_0_#211E25] transition-colors hover:bg-[#B84955] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Contact
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center border-2 border-[#211E25] bg-[#F6EBDD] text-[#211E25] cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile chapters"
          className="border-t-2 border-[#211E25] bg-[#FFF9F1] px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className="flex min-h-[44px] items-center border-b border-[#211E25]/15 px-2 text-base font-medium text-[#211E25] hover:text-[#B84955]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <button
                type="button"
                onClick={() => handleLinkClick('contact')}
                className="flex min-h-[44px] w-full items-center justify-center border-2 border-[#211E25] bg-[#632D40] px-4 py-2 text-sm font-semibold text-[#FFF9F1] shadow-[3px_3px_0_#211E25] cursor-pointer"
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
