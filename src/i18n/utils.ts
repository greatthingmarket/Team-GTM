// src/i18n/utils.ts
import { ui, defaultLang, type Locale } from './ui';

/**
 * Extrait la langue de l'URL actuelle.
 * Utile pour les composants côté serveur (Astro) et côté client.
 * * @param url - L'objet URL (ex: Astro.url)
 * @returns La locale détectée ou la langue par défaut ('en')
 */
export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang;
}

/**
 * Utilitaire pour récupérer l'objet de traduction pour une langue donnée.
 * Cette version est synchrone (pas besoin de 'await').
 * * @param lang - Le code langue (ex: 'fr', 'es')
 * @returns L'objet de traduction complet
 */
export function useTranslations(lang: string | undefined) {
  const currentLang = (lang && lang in ui ? lang : defaultLang) as Locale;
  return ui[currentLang];
}

/**
 * Génère une URL préfixée par la langue pour les liens de navigation.
 * @param lang - La langue cible
 * @param path - Le chemin relatif
 */
export function useTranslatedPath(lang: Locale) {
  return (path: string) => {
    // Évite les doubles slashs
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };
}

/**
 * Helper pour vérifier si une locale est supportée.
 */
export function isValidLocale(lang: string): lang is Locale {
  return lang in ui;
}