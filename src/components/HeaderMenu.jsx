import { h } from 'preact';
import LanguageSelector from './LanguageSelector.jsx';

export default function HeaderMenu({ isOpen, onClose, t, currentLang = 'en' }) {
  if (!isOpen) return null;

  return (
    <div
      class="fixed top-16 right-0 w-[70vw] h-[calc(100vh-4rem)] bg-light/95 backdrop-blur-sm shadow-lg z-40 flex flex-col items-stretch px-6 py-8 space-y-6 animate-slide-in overflow-y-auto"
    >
      {/* 🔧 NOUVEAU : Classe menu-item pour styling responsive */}
      <a 
        href="#deals-of-day" 
        onClick={onClose}
        class="menu-item text-dark hover:text-secondary transition font-medium"
      >
        {t.nav.flashDeals}
      </a>
      <a 
        href="#categories" 
        onClick={onClose}
        class="menu-item text-dark hover:text-secondary transition font-medium"
      >
        {t.nav.categories}
      </a>
      <a 
        href="#blog" 
        onClick={onClose}
        class="menu-item text-dark hover:text-secondary transition font-medium"
      >
        {t.nav.blog}
      </a>
      
      {/* Sélecteur de langue mobile */}
      <LanguageSelector currentLang={currentLang} isMobile={true} />
    </div>
  );
}