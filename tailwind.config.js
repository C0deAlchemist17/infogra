/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        // Mobile
        'xs': '375px',
        'sm': '640px',
        // Tablet
        'md': '768px',
        'lg': '1024px',
        // Desktop
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
    extend: {
      colors: {
        // INFOGRA Premium Color System
        background: {
          primary: 'rgba(3, 7, 18, 0.4)', // #030712 with opacity
          secondary: 'rgba(15, 23, 42, 0.6)', // #0f172a with opacity
          tertiary: 'rgba(30, 41, 59, 0.7)', // #1e293b with opacity
        },
        accent: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          highlight: '#06b6d4',
          success: '#10b981',
          error: '#ef4444',
        },
        text: {
          primary: '#ffffff',
          secondary: '#94a3b8',
          tertiary: '#64748b',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
        },
        // Legacy colors for compatibility
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
      fontSize: {
        // Enormous text - maximum readability
        'display-xs': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '4rem' } }],
        'display': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '4.5rem' } }],
        'display-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '5rem' } }],
        'display-xl': ['2.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '5.5rem' } }],
        'h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '3.5rem' } }],
        'h1-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '3rem' } }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '2.5rem' } }],
        'h2-sm': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '2.25rem' } }],
        'h3': ['1.75rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '2.25rem' } }],
        'h3-sm': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }, { '@media (min-width: 1024px)': { fontSize: '2rem' } }],
        'h4': ['1.5rem', { lineHeight: '1.5' }, { '@media (min-width: 1024px)': { fontSize: '2rem' } }],
        'h4-sm': ['1.25rem', { lineHeight: '1.5' }, { '@media (min-width: 1024px)': { fontSize: '1.75rem' } }],
        'body-lg': ['1.75rem', { lineHeight: '1.5' }, { '@media (min-width: 1024px)': { fontSize: '2rem' } }],
        'body': ['1.5rem', { lineHeight: '1.5' }, { '@media (min-width: 1024px)': { fontSize: '1.75rem' } }],
        'body-sm': ['1.25rem', { lineHeight: '1.5' }, { '@media (min-width: 1024px)': { fontSize: '1.5rem' } }],
        'small': ['1.125rem', { lineHeight: '1.4' }, { '@media (min-width: 1024px)': { fontSize: '1.25rem' } }],
        'caption': ['1rem', { lineHeight: '1.3' }, { '@media (min-width: 1024px)': { fontSize: '1.125rem' } }],
        'caption-sm': ['0.9375rem', { lineHeight: '1.3' }, { '@media (min-width: 1024px)': { fontSize: '1rem' } }],
      },
      spacing: {
        '4': '0.25rem',
        '8': '0.5rem',
        '16': '1rem',
        '24': '1.5rem',
        '32': '2rem',
        '48': '3rem',
        '64': '4rem',
        '96': '6rem',
        '128': '8rem',
        '192': '12rem',
        '18': '4.5rem',
        '88': '22rem',
        // Additional spacing for better desktop layout
        '72': '4.5rem',
        '80': '5rem',
        '96': '6rem',
        '112': '7rem',
        '128': '8rem',
        '144': '9rem',
        // Compact spacing for no-scroll layout
        '12': '0.75rem',
        '20': '1.25rem',
        '28': '1.75rem',
        '36': '2.25rem',
        '44': '2.75rem',
        '52': '3.25rem',
        '60': '3.75rem',
      },
      boxShadow: {
        subtle: '0 4px 20px rgba(0, 0, 0, 0.3)',
        medium: '0 8px 40px rgba(0, 0, 0, 0.4)',
        large: '0 16px 60px rgba(0, 0, 0, 0.5)',
        glow: '0 0 40px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 60px rgba(59, 130, 246, 0.5)',
        'glow-xl': '0 0 80px rgba(59, 130, 246, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "blur-reveal": {
          "0%": { filter: "blur(20px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        "magnetic": {
          "0%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(5px, -5px)" },
          "100%": { transform: "translate(0px, 0px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-in-up": "fade-in-up 1s ease-out",
        "fade-in-down": "fade-in-down 1s ease-out",
        "fade-in-left": "fade-in-left 1s ease-out",
        "fade-in-right": "fade-in-right 1s ease-out",
        "scale-in": "scale-in 0.8s ease-out",
        "slide-up": "slide-up 1.2s ease-out",
        "slide-down": "slide-down 1.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "blur-reveal": "blur-reveal 1s ease-out",
        "magnetic": "magnetic 0.3s ease-in-out",
      },
      transitionDuration: {
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease-in': 'ease-in',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e293b 100%)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Noto Sans Arabic", "var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
