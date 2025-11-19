# 🎨 Premium macOS-Inspired Design System

## ✨ Design Philosophy

Sky Desktop Assistant now features a **premium, macOS-inspired design** that prioritizes:

- **Visual Hierarchy** - Clear information architecture with sophisticated depth
- **Glassmorphism** - Advanced blur effects and translucency layers
- **Fluid Motion** - Smooth, physics-based animations (cubic-bezier easing)
- **Attention to Detail** - Pixel-perfect spacing, shadows, and micro-interactions
- **Cross-Platform** - Looks native on Windows while inspired by macOS elegance

---

## 🎨 Color Palette

### Primary Colors

```css
--sky-accent: #007AFF          /* Primary blue */
--sky-accent-hover: #0051D5    /* Hover state */
--sky-accent-light: #5AC8FA    /* Light accent */
```

### Backgrounds

```css
--sky-bg: rgba(255, 255, 255, 0.85)              /* Main background */
--sky-bg-dark: rgba(28, 28, 30, 0.95)           /* Dark mode */
--sky-bg-secondary: rgba(250, 250, 250, 0.8)    /* Secondary surfaces */
```

### Text

```css
--sky-text: #1D1D1F              /* Primary text */
--sky-text-secondary: #86868B    /* Secondary text */
--sky-text-tertiary: #C7C7CC     /* Tertiary text/hints */
```

### System Colors

```css
--sky-success: #34C759   /* Green (traffic light) */
--sky-warning: #FF9500   /* Yellow (traffic light) */
--sky-error: #FF3B30     /* Red (traffic light) */
--sky-purple: #AF52DE    /* Purple accent */
--sky-teal: #5AC8FA      /* Teal accent */
--sky-indigo: #5856D6    /* Indigo accent */
--sky-pink: #FF2D55      /* Pink accent */
```

---

## 🌫️ Glassmorphism Effects

### Premium Blur Levels

- **Light**: `backdrop-blur-sky-light` (40px) - Subtle depth
- **Standard**: `backdrop-blur-sky` (60px) - Default glass effect
- **Heavy**: `backdrop-blur-sky-heavy` (100px) - Maximum frosted glass

### Implementation

```tsx
className = "bg-sky-bg backdrop-blur-sky-heavy";
```

Creates layered transparency with:

- 85% white background opacity
- 100px blur radius
- Saturated colors (180%)
- Multi-layer depth perception

---

## 🎭 Shadows & Depth

### Shadow Hierarchy

```css
/* Subtle - Floating elements */
shadow-sky: 0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)

/* Large - Modal, popups */
shadow-sky-lg: 0 20px 60px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)

/* Hover - Interactive states */
shadow-sky-hover: 0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)

/* Inner - Recessed elements */
shadow-sky-inner: inset 0 1px 2px rgba(0, 0, 0, 0.05)

/* Glow - Focus/accent */
shadow-sky-glow: 0 0 20px rgba(0, 122, 255, 0.2)
```

---

## 🎬 Animation System

### Motion Principles

All animations use **macOS-style easing**:

```css
cubic-bezier(0.16, 1, 0.3, 1)  /* Spring-like, natural deceleration */
```

### Available Animations

#### Entry Animations

- `animate-fade-in` - Opacity fade (300ms)
- `animate-slide-up` - Slide from bottom (400ms)
- `animate-slide-down` - Slide from top (400ms)
- `animate-slide-left` - Slide from right (300ms)
- `animate-slide-right` - Slide from left (300ms)
- `animate-scale-in` - Scale + fade (200ms)

#### Continuous Animations

- `animate-shimmer` - Loading shimmer effect (2.5s infinite)
- `animate-pulse-subtle` - Breathing effect (3s infinite)
- `animate-bounce-subtle` - Gentle bounce (1s)
- `animate-glow` - Glow pulse (2s infinite)

### Usage Example

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.92, y: 10 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{
    duration: 0.45,
    ease: [0.16, 1, 0.3, 1],
  }}
>
  {content}
</motion.div>
```

---

## 🚦 macOS Traffic Lights

### Visual Design

Three iconic macOS window control buttons:

```tsx
/* Close (Red) */
<button className="w-3 h-3 rounded-full bg-sky-error shadow-inner">
  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40" />
</button>

/* Minimize (Yellow) */
<button className="w-3 h-3 rounded-full bg-sky-warning shadow-inner">
  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40" />
</button>

/* Expand (Green) */
<button className="w-3 h-3 rounded-full bg-sky-success shadow-inner">
  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40" />
</button>
```

### Interactions

- **Hover**: Scale 1.15x + subtle glow shadow
- **Click**: Scale 0.85x (tactile feedback)
- **Gradient overlay**: White 40% opacity from top-left

---

## 📝 Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;
```

### Type Scale

```css
text-xs:   0.75rem (12px) / 1rem      /* Captions */
text-sm:   0.875rem (14px) / 1.25rem  /* Secondary */
text-base: 1rem (16px) / 1.5rem       /* Body */
text-lg:   1.125rem (18px) / 1.75rem  /* Subheadings */
text-xl:   1.25rem (20px) / 1.75rem   /* Headings */
text-2xl:  1.5rem (24px) / 2rem       /* Titles */
```

### Text Rendering

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
font-feature-settings: "kern" 1;
```

---

## 🎯 Border Radius

### Rounded Corners

```css
rounded-sky:    12px   /* Default */
rounded-sky-lg: 16px   /* Cards */
rounded-sky-xl: 20px   /* Windows */
rounded-sky-2xl: 24px  /* Large containers */
```

macOS uses **generous radius** for modern, soft appearance.

---

## 🔲 Spacing System

Following **8px grid system**:

```css
0.5 → 2px
1   → 4px
2   → 8px
3   → 12px
4   → 16px
6   → 24px
8   → 32px
12  → 48px
16  → 64px
```

---

## 🎨 Component Enhancements

### Floating Window (Compact Mode)

```tsx
Features:
✓ 85% white background + 100px blur
✓ Multi-layer gradient overlays
✓ macOS traffic lights with glow effects
✓ 9px header with subtle border
✓ Smooth spring animation on mount
✓ Draggable header region
```

### Expanded Window

```tsx
Features:
✓ Gradient background (white → secondary → white)
✓ Ambient colored glow effects (blue/purple)
✓ 14px header with frosted glass
✓ Refined sidebar with smooth transitions
✓ Premium shadow hierarchy
✓ Full-screen optimized layout
```

### Message Input

```tsx
Features:
✓ White 60% background with blur
✓ Focus ring: 2px sky-accent/20
✓ Gradient send button (accent → accent-hover)
✓ Keyboard hint (⌘ or Ctrl + ↵)
✓ Auto-resize textarea
✓ Icon animation on hover (translate + rotate)
```

### Chat Messages

```tsx
Features:
✓ User: Right-aligned, blue gradient background
✓ Assistant: Left-aligned, white glass background
✓ Markdown rendering with syntax highlighting
✓ Code blocks: Dark theme with copy button
✓ Slide-up animation on entry
✓ Avatar with gradient border
```

---

## 📱 Responsive Behavior

### Compact Mode (420×120px)

- Minimalist: Traffic lights + input
- Always on top
- Non-resizable
- Bottom-right positioning

### Expanded Mode (900×700px)

- Full-featured: Sidebar + chat + actions
- Normal window behavior
- Resizable
- Center-screen positioning
- Min size: 380×600px

---

## 🎨 Gradient Recipes

### Button Gradient

```css
bg-gradient-to-br from-sky-accent to-sky-accent-hover
```

### Background Ambient

```css
bg-gradient-to-br from-sky-accent-light/5 via-transparent to-sky-purple/5
```

### Glow Orbs

```css
<div class="absolute top-0 left-0 w-96 h-96 bg-sky-accent/5 rounded-full blur-3xl" />
<div class="absolute bottom-0 right-0 w-96 h-96 bg-sky-purple/5 rounded-full blur-3xl" />
```

---

## 🖱️ Interaction States

### Buttons

```tsx
<motion.button
  whileHover={{ scale: 1.08, rotate: 5 }}
  whileTap={{ scale: 0.92 }}
  className="transition-all duration-200"
>
```

### Cards

```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.14)'
  }}
  transition={{ duration: 0.2 }}
>
```

### Input Focus

```css
focus:border-sky-accent/40
focus:ring-2
focus:ring-sky-accent/20
transition-all duration-200
```

---

## 🎭 Micro-interactions

### Traffic Light Hover

- Scale: 1.0 → 1.15
- Add colored glow shadow
- White overlay fade in
- Duration: 200ms

### Send Button

- Hover: Scale 1.08 + rotate 5deg + translate icon
- Click: Scale 0.92
- Gradient shine overlay
- Spring easing

### Conversation Item

- Hover: Background fade, scale 1.01
- Swipe: Transform X with resistance
- Delete: Fade out + scale 0.95
- Selection: Accent background

---

## 🌈 Advanced Effects

### Shimmer Loading

```css
background: linear-gradient(
  90deg,
  transparent,
  rgba(255, 255, 255, 0.3),
  transparent
);
background-size: 200% 100%;
animation: shimmer 2.5s ease-in-out infinite;
```

### Pulse Glow

```css
@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 122, 255, 0.4);
  }
}
```

---

## 📏 Layout Principles

### Content Density

- **Compact**: Maximum efficiency, minimal chrome
- **Expanded**: Comfortable reading, generous whitespace
- **Sidebar**: 240px fixed width
- **Messages**: 16px vertical spacing
- **Actions**: Horizontal scroll, 8px gap

### Visual Balance

- **Symmetry**: Centered header text, balanced controls
- **Alignment**: Left for content, right for metadata
- **Proximity**: Related items grouped tightly
- **Contrast**: White space separates sections

---

## 🎯 Accessibility

### Focus Management

- Visible focus rings: 2px accent color
- Skip to content functionality
- Keyboard navigation support
- ARIA labels on interactive elements

### Color Contrast

- Text: WCAG AA compliant
- Interactive: Minimum 3:1 ratio
- Disabled states: 30% opacity
- High contrast mode compatible

---

## 🚀 Performance

### Optimizations

- Hardware-accelerated CSS (transform, opacity)
- Will-change hints for animations
- GPU compositing for blur effects
- Debounced scroll handlers
- Memoized components

### Best Practices

- Use `motion.div` for complex animations
- Apply `backdrop-filter` sparingly
- Limit shadow blur radius
- Optimize re-renders with React.memo
- Lazy load heavy components

---

## 🎨 Design Tokens Reference

### Complete Tailwind Config

```javascript
colors: {
  sky: {
    accent: '#007AFF',
    'accent-hover': '#0051D5',
    'accent-light': '#5AC8FA',
    bg: 'rgba(255, 255, 255, 0.85)',
    // ... (see tailwind.config.js for complete list)
  }
}

backdropBlur: {
  'sky-light': '40px',
  'sky': '60px',
  'sky-heavy': '100px',
}

animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  // ... (complete animation suite)
}
```

---

## 🎓 Design Philosophy Summary

### Core Principles

1. **Clarity** - Every element serves a purpose
2. **Depth** - Layered surfaces create hierarchy
3. **Motion** - Animations guide attention
4. **Consistency** - Unified visual language
5. **Delight** - Micro-interactions add joy

### Inspiration

- **macOS Big Sur+** - Modern, translucent interfaces
- **iOS Design** - Touch-optimized interactions
- **Material Design 3** - Adaptive color systems
- **Fluent Design** - Acrylic materials, depth

---

**Result**: A premium, polished desktop assistant that feels native on Windows while embodying the elegance of macOS design language. 🎨✨

---

## 📚 Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Created with attention to every pixel** 💎
