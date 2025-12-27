// src/components/LanguageSelector.jsx
import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

// Imports des drapeaux
import enFlag from '../assets/flags/en_flag.png';
import frFlag from '../assets/flags/fr_flag.png';
import esFlag from '../assets/flags/es_flag.png';
import deFlag from '../assets/flags/de_flag.png';
import arFlag from '../assets/flags/ar_flag.png';
import ptFlag from '../assets/flags/pt_flag.png';

const languages = [
  { code: 'en', name: 'English', flagSrc: enFlag },
  { code: 'fr', name: 'Français', flagSrc: frFlag },
  { code: 'es', name: 'Español', flagSrc: esFlag },
  { code: 'de', name: 'Deutsch', flagSrc: deFlag },
  { code: 'ar', name: 'العربية', flagSrc: arFlag },
  { code: 'pt', name: 'Português', flagSrc: ptFlag },
];

export default function LanguageSelector({ currentLang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLangCode) => {
    if (newLangCode === currentLang) {
      setIsOpen(false);
      return;
    }

    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);

    // LOGIQUE DE REDIRECTION :
    // 1. Si on est sur l'accueil (ex: /fr/ ou /ar/)
    if (segments.length <= 1) {
      window.location.href = `/${newLangCode}/`;
    } 
    // 2. Si on est sur une page profonde (ex: /fr/blog/article)
    else {
      segments[0] = newLangCode;
      window.location.href = '/' + segments.join('/') + '/';
    }
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Bouton Principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
          <img 
            src={currentLanguage.flagSrc.src} 
            alt={currentLanguage.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-bold text-slate-700 uppercase">
          {currentLanguage.code}
        </span>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu Déroulant */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  lang.code === currentLang 
                    ? 'bg-primary/5 text-primary font-bold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={lang.flagSrc.src} 
                    alt={lang.name} 
                    className="h-3 w-5 rounded-sm object-cover shadow-sm" 
                  />
                  <span>{lang.name}</span>
                </div>
                {lang.code === currentLang && (
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}