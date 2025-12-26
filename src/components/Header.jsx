// src/components/Header.jsx
import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import HeaderMenu from './HeaderMenu.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import logoImg from '../assets/Great_logo.png'; 

export default function Header(props) {
  const p = props ?? {};
  const t = p.t ?? {};
  const currentLang = p.currentLang ?? 'en';
  const labels = t?.nav ?? {};
  const cta = t?.cta ?? {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const burgerButtonRef = useRef(null);

  // Gestion du scroll pour l'effet sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Gestion intelligente du scroll et de la navigation
   * Si on est sur la home, on scroll. Sinon, on laisse le href naviguer vers la home.
   */
  const handleNavClick = (e, id) => {
    const isHomePage = window.location.pathname === `/${currentLang}/` || window.location.pathname === `/${currentLang}`;
    
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
        setMenuOpen(false);
      }
    }
    // Si pas sur la home, le comportement par défaut (href) redirigera vers /lang/#id
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a href={`/${currentLang}/`} className="flex items-center gap-2">
              <img src={logoImg.src} alt="Logo" className="h-10 w-auto object-contain" />
              <span className="hidden sm:block font-poppins font-bold text-xl text-[#1a936f]">
                Great Thing Market
              </span>
            </a>
          </div>

          {/* Desktop Navigation (lg+) */}
          <nav className="hidden lg:flex items-center space-x-8 font-poppins font-medium text-slate-700">
            <a 
              href={`/${currentLang}/#deals-of-day`} 
              onClick={(e) => handleNavClick(e, 'deals-of-day')} 
              className="hover:text-[#1a936f] transition-colors"
            >
              {labels.flashDeals}
            </a>
            <a 
              href={`/${currentLang}/#categories`} 
              onClick={(e) => handleNavClick(e, 'categories')} 
              className="hover:text-[#1a936f] transition-colors"
            >
              {labels.categories}
            </a>
            <a 
              href={`/${currentLang}/#blog`} 
              onClick={(e) => handleNavClick(e, 'blog')} 
              className="hover:text-[#1a936f] transition-colors"
            >
              {labels.blog}
            </a>
            <LanguageSelector currentLang={currentLang} />
          </nav>

          {/* Action Area (CTA & Mobile Toggle) */}
          <div className="flex items-center space-x-4">
            <a
              href={`/${currentLang}/#newsletter`}
              onClick={(e) => handleNavClick(e, 'newsletter')}
              className="shine-effect relative overflow-hidden bg-[#1a936f] text-white px-5 py-2.5 rounded-full font-poppins font-bold text-sm hover:bg-[#147a5c] transition transform hover:scale-105 shadow-md shadow-green-100/50"
            >
              <span className="relative z-10">{cta.exclusive || 'Offers'}</span>
            </a>

            <button
              ref={burgerButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <HeaderMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        t={t} 
        currentLang={currentLang} 
        scrollToSection={handleNavClick} 
      />
    </header>
  );
}