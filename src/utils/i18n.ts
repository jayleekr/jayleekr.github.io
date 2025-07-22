import i18next from "i18next";
import type { TFunction } from "i18next";

export const supportedLanguages = ["ko", "en"] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const defaultLanguage: SupportedLanguage = "ko";

// Helper to get language from URL
export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split("/");
  if (supportedLanguages.includes(lang as SupportedLanguage)) {
    return lang as SupportedLanguage;
  }
  return defaultLanguage;
}

// Helper to get t function for a specific language
export function getTranslation(lang: SupportedLanguage): TFunction {
  return i18next.getFixedT(lang, "common");
}

// Helper to generate localized paths
export function getLocalizedPath(path: string, lang: SupportedLanguage): string {
  // Remove any existing language prefix
  const cleanPath = path.replace(/^\/(ko|en)/, "");
  
  // For default language (ko), don't add prefix
  if (lang === defaultLanguage) {
    return cleanPath || "/";
  }
  
  // For other languages, add language prefix
  return `/${lang}${cleanPath || "/"}`;
}

// Helper to get alternate language links
export function getAlternateLinks(currentPath: string) {
  return supportedLanguages.map(lang => ({
    lang,
    href: getLocalizedPath(currentPath, lang)
  }));
}