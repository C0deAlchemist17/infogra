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
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
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
          primary: '#030712',
          secondary: '#0f172a',
          tertiary: '#1e293b',
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
        'display-xs': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['7rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1-sm': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3-sm': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h4': ['1.5rem', { lineHeight: '1.4' }],
        'h4-sm': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
        'caption-sm': ['0.625rem', { lineHeight: '1.4' }],
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
      },
      boxShadow: {
        subtle: '0 4px 20px rgba(0, 0, 0, 0.3)',
        medium: '0 8px 40px rgba(0, 0, 0, 0.4)',
        large: '0 16px 60px rgba(0, 0, 0, 0.5)',
        glow: '0 0 40px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 60px rgba(59, 130, 246, 0.5)',
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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
