# CSS Import Guide for React UI Components

## File Structure

```
css/
├── core-react.css              # Base variables and utilities (IMPORT FIRST)
├── heartbox-react.css          # HeartBox component styles
├── gamehud-react.css           # GameHUD buttons styles
├── stats-react.css             # Stats HUD and tabs styles
├── ingame-menu-react.css       # Ingame menu styles
├── controls-react.css          # Controls menu styles
└── dialogue-react.css          # Dialog box styles
```

## Option 1: Import All in Your Main Entry File

**Recommended for most projects**

In your `main.ts` or `game.ts`:

```typescript
// Import in this order - core must be first!
import './css/core-react.css';
import './css/heartbox-react.css';
import './css/gamehud-react.css';
import './css/stats-react.css';
import './css/ingame-menu-react.css';
import './css/controls-react.css';
import './css/dialogue-react.css';

// Then import your React UI
import { UIReact } from './source_code/singletons/UIReact.tsx';

// Initialize
window.ui = new UIReact();
window.ui.initialize();
```

## Option 2: Import Individual Files as Needed

**Good for code splitting**

In each component file:

```typescript
// HeartBox.tsx
import './css/core-react.css'; // Core variables
import './css/heartbox-react.css'; // Component-specific styles

export const HeartBox: React.FC<HeartBoxProps> = ({ heartCount }) => {
  // Component code...
};
```

## Option 3: Create a Master CSS Import File

**Best for organization**

Create `css/ui-react-all.css`:

```css
/* Import order matters - core first! */
@import './core-react.css';
@import './heartbox-react.css';
@import './gamehud-react.css';
@import './stats-react.css';
@import './ingame-menu-react.css';
@import './controls-react.css';
@import './dialogue-react.css';
```

Then in your main file:

```typescript
import './css/ui-react-all.css';
```

## Option 4: Link in HTML (Traditional)

In your `index.html`:

```html
<head>
  <!-- Core must be first -->
  <link rel="stylesheet" href="./css/core-react.css">
  
  <!-- Component styles -->
  <link rel="stylesheet" href="./css/heartbox-react.css">
  <link rel="stylesheet" href="./css/gamehud-react.css">
  <link rel="stylesheet" href="./css/stats-react.css">
  <link rel="stylesheet" href="./css/ingame-menu-react.css">
  <link rel="stylesheet" href="./css/controls-react.css">
  <link rel="stylesheet" href="./css/dialogue-react.css">
</head>
```

## Customization Guide

### Changing Colors

Edit `core-react.css`:

```css
:root {
  /* Your custom colors */
  --accent-color: #ff6b6b; /* Change from blue to red */
  --primary-bg: rgba(0, 0, 0, 0.95); /* Darker background */
}
```

All components will automatically use the new colors!

### Adjusting Spacing

Edit `core-react.css`:

```css
:root {
  /* Increase all spacing */
  --spacing-sm: 12px;  /* was 8px */
  --spacing-md: 24px;  /* was 16px */
  --spacing-lg: 32px;  /* was 24px */
}
```

### Changing Animations

Edit `core-react.css`:

```css
:root {
  /* Slower animations */
  --transition-fast: 300ms ease;  /* was 150ms */
  --transition-medium: 500ms ease; /* was 250ms */
}
```

## CSS Variable Reference

### Colors
```css
--primary-bg        /* Main background color */
--secondary-bg      /* Secondary background */
--accent-color      /* Highlight/interactive elements */
--accent-glow       /* Glow effects */
--text-primary      /* Main text color */
--text-secondary    /* Secondary text */
--border-color      /* Borders and dividers */
--danger-color      /* Errors, damage */
--success-color     /* Success states */
--warning-color     /* Warnings */
```

### Spacing
```css
--spacing-xs        /* 4px - very tight */
--spacing-sm        /* 8px - small gaps */
--spacing-md        /* 16px - standard */
--spacing-lg        /* 24px - large gaps */
--spacing-xl        /* 32px - extra large */
--spacing-2xl       /* 48px - huge gaps */
```

### Transitions
```css
--transition-fast   /* 150ms - quick interactions */
--transition-medium /* 250ms - standard */
--transition-slow   /* 400ms - dramatic effects */
```

### Z-Index Layers
```css
--z-game-canvas     /* 0 - game layer */
--z-ui-base         /* 900 - base UI */
--z-ui-hud          /* 1000 - HUD elements */
--z-ui-menu         /* 1100 - menus */
--z-ui-dialog       /* 1200 - dialogs */
--z-ui-tooltip      /* 1300 - tooltips */
```

## Troubleshooting

### Styles not applying?

1. **Check import order** - `core-react.css` must be imported first
2. **Check file paths** - Verify CSS files are in correct location
3. **Clear cache** - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. **Check console** - Look for 404 errors for missing CSS files

### Components positioned wrong?

Check if `#ui-root` has these styles:
```css
#ui-root {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
```

### Styles conflict with existing CSS?

Add more specificity:
```css
/* In your component CSS */
.ui-root .stats-hud {
  /* Your styles with higher specificity */
}
```

Or use CSS modules for complete isolation.

## Performance Tips

1. **Minimize imports** - Only import CSS for components you use
2. **Use CSS variables** - Faster than inline styles
3. **Avoid !important** - Maintain specificity hierarchy
4. **Combine files in production** - One CSS file loads faster

## Migration from Old CSS

If you have existing CSS files, you can gradually replace them:

1. Keep old CSS files for now
2. Add new React CSS files
3. Test each component
4. Remove old CSS once confirmed working

Example:
```typescript
// Old (keep temporarily)
import './heartbox.css';

// New (add alongside)
import './css/heartbox-react.css';

// Test, then remove old import
```

## Building for Production

If using a bundler (Vite, webpack):

```typescript
// Vite will automatically bundle all imported CSS
import './css/ui-react-all.css';

// Build command
npm run build

// Result: Single minified CSS file
```

## Additional Resources

- CSS Variables: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations
- Flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- Grid: https://css-tricks.com/snippets/css/complete-guide-grid/

---

Happy styling! 🎨
