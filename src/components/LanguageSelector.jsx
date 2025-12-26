// src/components/LanguageSelector.jsx
import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

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

export default function LanguageSelector({ currentLang = 'en', isMobile = false }) {
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

  const handleLanguageChange = (langCode) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    // Récupération du chemin actuel (ex: /fr/blog/mon-article)
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);

    // On remplace le premier segment (la langue) ou on l'ajoute
    // Si l'URL est juste "/" ou vide, on redirige vers /code/
    let newPath = `/${langCode}`;
    
    if (segments.length > 1) {
      const remainingPath = segments.slice(1).join('/');
      newPath = `/${langCode}/${remainingPath}`;
    }

    window.location.href = newPath;
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  // --- VERSION MOBILE ---
  if (isMobile) {
    return (
      <div class="grid grid-cols-3 gap-3 p-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            class={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
              lang.code === currentLang 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-slate-100 text-slate-600'
            }`}
          >
            <img src={lang.flagSrc.src} alt={lang.name} class="h-6 w-8 rounded shadow-sm" />
            <span class="text-xs font-bold">{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  // --- VERSION DESKTOP ---
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img 
          src={currentLanguage.flagSrc.src} 
          alt={currentLanguage.name} 
          class="h-4 w-6 rounded-sm object-cover shadow-sm" 
        />
        <span class="text-sm font-bold text-slate-700 uppercase">
          {currentLanguage.code}
        </span>
        <svg 
          class={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[100] animate-in fade-in zoom-in duration-200 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              class={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                lang.code === currentLang 
                  ? 'bg-primary/5 text-primary font-bold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <div class="flex items-center gap-3">
                <img src={lang.flagSrc.src} alt={lang.name} class="h-3 w-5 rounded-sm object-cover" />
                <span>{lang.name}</span>
              </div>
              {lang.code === currentLang && (
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}