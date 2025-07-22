import { localizePath, interpolate } from "astro-i18next";

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'ko';
}

export function useTranslations(lang: string) {
  return function (key: string): string {
    return interpolate(key, {}, { lng: lang });
  };
}

export function localizedPath(path: string, lang: string): string {
  return localizePath(path, lang);
}

export function getAlternateLangPath(currentPath: string, currentLang: string): string {
  const targetLang = currentLang === 'ko' ? 'en' : 'ko';
  
  if (currentLang === 'ko') {
    return `/en${currentPath}`;
  } else {
    return currentPath.replace(/^\/en/, '') || '/';
  }
}