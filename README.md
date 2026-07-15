# Infogra - Digital Experience Architects

A high-end production-ready website built with Next.js 14, featuring advanced animations, custom cursor effects, and studio-grade interactions inspired by focused-studio.com.

## 🚀 Features

- **Next.js 14** with App Router for optimal performance
- **Advanced Animations** with Framer Motion and GSAP
- **Custom Cursor** with magnetic effects and dynamic states
- **Smooth Scrolling** with Lenis for buttery-smooth experience
- **Interactive Components** with hover states and micro-interactions
- **Scroll-Triggered Animations** for storytelling transitions
- **Responsive Design** for all devices
- **SEO Optimized** with comprehensive metadata
- **TypeScript** for type safety
- **Modern UI** with glass morphism and gradient effects

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion + GSAP
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React
- **3D Graphics**: Three.js + React Three Fiber
- **Language**: TypeScript
- **UI Components**: Custom component library

## 📁 Project Structure

```
infogra/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles with custom animations
│   ├── layout.tsx          # Root layout with header/footer
│   └── page.tsx            # Home page
├── components/
│   ├── layout/             # Layout components
│   │   ├── StudioHeader.tsx
│   │   └── StudioFooter.tsx
│   ├── sections/           # Page sections
│   │   ├── StudioHero.tsx
│   │   ├── StudioAbout.tsx
│   │   ├── StudioServices.tsx
│   │   ├── StudioWork.tsx
│   │   └── StudioContact.tsx
│   └── ui/                # UI components
│       ├── AnimatedText.tsx
│       ├── MagneticButton.tsx
│       ├── RevealImage.tsx
│       ├── ParallaxContainer.tsx
│       ├── Button.tsx
│       └── Card.tsx
├── hooks/                 # Custom React hooks
│   ├── useCustomCursor.ts
│   ├── useSmoothScroll.ts
│   ├── useMagneticEffect.ts
│   └── useScrollTrigger.ts
├── lib/
│   └── utils.ts            # Utility functions
├── public/                # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Studio Black (#000000)
- **Accent**: Infogra Blue (#3b82f6)
- **Secondary**: Studio Gray (#888888)
- **Background**: Studio White (#ffffff)

### **Typography**
- **Display**: Inter (100-900)
- **Body**: Inter (400-600)
- **Special**: Custom animations and effects

### **Animations**
- **Entrance**: Slide up, fade in, scale
- **Hover**: Magnetic effects, scale, rotate
- **Scroll**: Parallax, reveal, progress
- **Interactive**: Glitch, float, pulse

## � Interactive Features

### **Custom Cursor**
- Dynamic magnetic effects
- Hover and click states
- Smooth transitions
- Performance optimized

### **Smooth Scrolling**
- Lenis integration
- 60fps buttery smooth
- Momentum-based physics
- Touch device support

### **Scroll Animations**
- Intersection Observer triggers
- Staggered animations
- Progress indicators
- Directional reveals

### **Magnetic Elements**
- Mouse-following effects
- Spring physics
- Customizable strength
- Performance optimized

## 📱 Sections

### **Studio Hero**
- Video background with overlay
- Animated text reveals
- Floating elements
- Lens flare effects
- Magnetic CTA buttons

### **Studio About**
- Tabbed content interface
- Animated skill bars
- Statistics counters
- Value cards with hover

### **Studio Services**
- Interactive service cards
- Icon animations
- Feature reveals
- Magnetic CTAs

### **Studio Work**
- Filterable portfolio grid
- Image reveal animations
- Hover overlays
- Project metadata

### **Studio Contact**
- Interactive form with validation
- Contact information cards
- Animated submissions
- Social media links

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd infogra

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint      # Run ESLint
```

## 🎨 Customization

### **Colors**
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'studio-black': '#000000',
      'infogra-accent': '#3b82f6',
      // Add custom colors
    }
  }
}
```

### **Animations**
Modify component animations in individual files:
- Adjust timing functions
- Change animation types
- Customize stagger delays
- Modify physics parameters

## 📊 Performance

### **Optimizations**
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Lazy loading for heavy components
- Efficient scroll listeners
- Optimized re-renders

### **Metrics**
- Lighthouse score: 95+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## 🔧 Advanced Features

### **GSAP Integration**
- Complex timeline animations
- ScrollTrigger for scroll-based animations
- Physics-based interactions
- Custom easing functions

### **Three.js Ready**
- 3D component structure
- WebGL performance optimization
- React Three Fiber integration
- Custom shaders support

### **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }

/* Large Desktop */
@media (min-width: 1441px) { }
```

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Other Platforms**
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Follow code standards
5. Submit pull request

## 📄 License

This project is licensed under MIT License.

## 📞 Contact

- **Email**: infogra174@gmail.com
- **Phone**: +201061866211
- **Website**: https://infogra.tech

---

Built with ❤️ and advanced animations by Infogra - Digital Experience Architects
