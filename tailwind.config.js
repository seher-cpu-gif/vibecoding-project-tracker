/** @type {import('tailwindcss').Config} */

// Each colour reads from a CSS variable defined in src/index.css.
const withVar = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: withVar('brand-primary'),
          accent: withVar('brand-accent'),
        },
        surface: {
          page: withVar('surface-page'),
          card: withVar('surface-card'),
        },
        ink: {
          DEFAULT: withVar('ink'),
          muted: withVar('ink-muted'),
        },
        type: {
          feature: withVar('type-feature'),
          bug: withVar('type-bug'),
        },
        due: {
          safe: withVar('due-safe'),
          warning: withVar('due-warning'),
          overdue: withVar('due-overdue'),
          neutral: withVar('due-neutral'),
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
