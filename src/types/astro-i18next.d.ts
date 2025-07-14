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

  function astroI18next(config?: Partial<AstroI18nextConfig>): any;
  export default astroI18next;
}