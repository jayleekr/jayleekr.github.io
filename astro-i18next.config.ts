import type { AstroI18nextConfig } from "astro-i18next";

const config: AstroI18nextConfig = {
  defaultLanguage: "ko",
  supportedLanguages: ["ko", "en"],
  i18next: {
    debug: true,
    initImmediate: false,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  },
  i18nextPlugins: { 
    fsBackend: "i18next-fs-backend",
    httpBackend: "i18next-http-backend" 
  },
};

export default config;