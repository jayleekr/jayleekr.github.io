/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      maxWidth: {
        'content': 'var(--content-max-width)',
      },
      colors: {
        link: {
          DEFAULT: 'var(--link)',
          hover: 'var(--link-hover)',
        },
        // Temporary: minimal color support for legacy components (will be removed in Phase 4)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: 'var(--link)',
          500: 'var(--link)',
          600: 'var(--link)',
          700: 'var(--link-hover)',
          800: 'var(--link-hover)',
          900: '#0c4a6e',
        },
      },
    },
  },
  // Remove @tailwindcss/typography for ultra-minimal approach
  // All prose styling handled in global.css
  plugins: [],
};
