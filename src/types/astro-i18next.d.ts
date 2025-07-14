declare module "astro-i18next" {
  export interface AstroI18nextConfig {
    defaultLanguage: string;
    supportedLanguages: string[];
    i18next: {
      debug?: boolean;
      initImmediate?: boolean;
      backend?: {
        loadPath: string;
      };
    };
    i18nextPlugins?: {
      fsBackend?: string;
      httpBackend?: string;
    };
  }

  const astroI18next: {
    config: AstroI18nextConfig;
    init: (config: AstroI18nextConfig) => void;
  };
  export default astroI18next;
}