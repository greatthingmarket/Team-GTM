// src/i18n/ui.ts

// ✅ Imports statiques pour un typage robuste et des performances accrues au build
import en from './en.js';
import fr from './fr.js';
import es from './es.js';
import de from './de.js';
import ar from './ar.js';
import pt from './pt.js';

// ✅ Configuration centrale de l'interface utilisateur
export const ui = {
  en,
  fr,
  es,
  de,
  ar,
  pt,
} as const;

// ✅ Typages exportés pour utilisation dans tout le projet
export type Locale = keyof typeof ui;
export const defaultLang: Locale = 'en';

// ✅ Liste des langues supportées (utile pour getStaticPaths)
export const languages = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  ar: 'العربية',
  pt: 'Português',
};

/**
 * Utilitaire pour récupérer les traductions de manière synchrone.
 * Supprime le besoin de 'await' et sécurise le typage.
 * * @param lang - La langue souhaitée (ex: 'fr')
 * @returns L'objet de traduction complet pour la langue donnée
 */
export function useTranslations(lang: string | undefined) {
  const currentLang = (lang && lang in ui ? lang : defaultLang) as Locale;
  return ui[currentLang];
}

/**
 * Utilitaire pour extraire la langue depuis l'URL (côté client ou serveur)
 */
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang;
}