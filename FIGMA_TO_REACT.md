# Figma to React Component Conversion Guide

## Quick Reference for Converting Figma Designs to React Components

### Step 1: Analyze Your Figma Component

When looking at a Figma component, identify:
1. **Layout:** Flexbox, Grid, Absolute positioning
2. **Dimensions:** Width, height, padding, margin
3. **Typography:** Font family, size, weight, line height
4. **Colors:** Fill, stroke, shadows
5. **Effects:** Border radius, shadows, blur
6. **States:** Default, hover, active, disabled
7. **Variants:** Different versions of the component

### Step 2: Export Assets

```bash
# From Figma:
# 1. Select your UI element
# 2. Right click → Export
# 3. Choose format (PNG for raster, SVG for vector)
# 4. Export at 2x for retina displays

# Organize in your project:
assets/
├── icons/
│   ├── btn-stats.svg
│   ├── btn-hands.svg
│   └── btn-interact.svg
├── backgrounds/
│   └── ui-panel-bg.png
└── fonts/
    └── PressStart2P.woff2
```

### Step 3: Convert Figma Properties to CSS

#### Figma → CSS Translation Table

| Figma Property | CSS Equivalent | Example |
|---------------|----------------|---------|
| **Layout** |
| Auto Layout (Horizontal) | `display: flex; flex-direction: row;` | `<div style={{display: 'flex'}}` |
| Auto Layout (Vertical) | `display: flex; flex-direction: column;` | |
| Spacing Between | `gap: Xpx;` | `gap: 8px;` |
| Padding | `padding: Xpx;` | `padding: 16px;` |
| Fixed Width | `width: Xpx;` | `width: 64px;` |
| Hug Contents | `width: fit-content;` | |
| Fill Container | `width: 100%;` | |
| **Typography** |
| Font Family | `font-family: 'Name';` | `font-family: 'Press Start 2P';` |
| Font Size | `font-size: Xpx;` | `font-size: 12px;` |
| Font Weight | `font-weight: 400-900;` | `font-weight: 700;` |
| Line Height | `line-height: X;` | `line-height: 1.5;` |
| Letter Spacing | `letter-spacing: Xpx;` | `letter-spacing: 1px;` |
| Text Align | `text-align: left/center/right;` | `text-align: center;` |
| **Colors** |
| Fill | `background-color: #hex;` | `background: #60a5fa;` |
| Stroke | `border: Xpx solid #hex;` | `border: 2px solid #fff;` |
| Opacity | `opacity: 0-1;` | `opacity: 0.9;` |
| **Effects** |
| Corner Radius | `border-radius: Xpx;` | `border-radius: 12px;` |
| Drop Shadow | `box-shadow: X Y blur spread color;` | `box-shadow: 0 4px 8px rgba(0,0,0,0.3);` |
| Inner Shadow | `box-shadow: inset X Y blur spread color;` | `box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);` |
| Blur | `backdrop-filter: blur(Xpx);` | `backdrop-filter: blur(10px);` |

### Step 4: Create React Component from Figma

#### Example: Button Component

**Figma Specifications:**
- Width: 64px
- Height: 64px
- Border Radius: 12px
- Background: #1e293b (with 90% opacity)
- Border: 2px solid #475569
- Icon: 48px × 48px centered
- Hover: Border color changes to #60a5fa, lifts 4px
- Active: Scales to 95%

**React Component:**

```typescript
interface GameButtonProps {
  icon: string;
  onClick: () => void;
  label?: string;
}

export const GameButton: React.FC<GameButtonProps> = ({ 
  icon, 
  onClick, 
  label 
}) => {
  return (
    <button
      className="game-button"
      onClick={onClick}
      aria-label={label}
    >
      <img src={icon} alt={label} />
    </button>
  );
};
```

**CSS (from Figma):**

```css
.game-button {
  /* Layout - from Figma Frame */
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Colors - from Figma Fill & Stroke */
  background: rgba(30, 41, 59, 0.9); /* #1e293b at 90% */
  border: 2px solid #475569;
  
  /* Effects - from Figma Effects */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  
  /* Interaction */
  cursor: pointer;
  transition: all 150ms ease;
  
  /* Reset defaults */
  padding: 0;
  overflow: hidden;
  position: relative;
}

.game-button img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  pointer-events: none;
}

/* Hover state - from Figma variants */
.game-button:hover {
  border-color: #60a5fa;
  box-shadow: 0 0 16px rgba(96, 165, 250, 0.6);
  transform: translateY(-4px);
}

/* Active state */
.game-button:active {
  transform: translateY(-2px) scale(0.95);
}
```

### Step 5: Handle Component States

```typescript
export const GameButton: React.FC<GameButtonProps> = ({ 
  icon, 
  onClick, 
  label,
  disabled = false // Add state handling
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      className={`game-button ${disabled ? 'disabled' : ''} ${isPressed ? 'pressed' : ''}`}
      onClick={onClick}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      disabled={disabled}
      aria-label={label}
    >
      <img src={icon} alt={label} />
    </button>
  );
};
```

### Step 6: Responsive Design from Figma

If your Figma has multiple breakpoints:

```css
/* Desktop - from Figma Desktop frame */
.game-button {
  width: 64px;
  height: 64px;
}

/* Tablet - from Figma Tablet frame */
@media (max-width: 1024px) {
  .game-button {
    width: 56px;
    height: 56px;
  }
}

/* Mobile - from Figma Mobile frame */
@media (max-width: 768px) {
  .game-button {
    width: 48px;
    height: 48px;
  }
}
```

### Step 7: Extract Figma Colors to CSS Variables

In Figma, check your color styles:

```css
:root {
  /* From Figma Color Styles */
  --primary-bg: #0f172a;      /* Background/Primary */
  --secondary-bg: #1e293b;    /* Background/Secondary */
  --accent-color: #60a5fa;    /* Accent/Blue */
  --accent-glow: #3b82f6;     /* Accent/Blue Dark */
  --text-primary: #f1f5f9;    /* Text/Primary */
  --text-secondary: #cbd5e1;  /* Text/Secondary */
  --border-color: #475569;    /* Border/Default */
  --danger-color: #ef4444;    /* Status/Danger */
  --success-color: #10b981;   /* Status/Success */
}
```

### Step 8: Complex Layout Conversion

#### Grid Layout in Figma

**Figma:** 3-column grid, 16px gap

```css
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}
```

#### Absolute Positioning in Figma

**Figma:** Element at X: 24, Y: 24 from top-left

```css
.positioned-element {
  position: absolute;
  top: 24px;
  left: 24px;
}
```

### Step 9: Animations from Figma Prototypes

Figma Prototype → CSS Animation:

**Figma Smart Animate:**
- Duration: 300ms
- Easing: Ease out
- Property: Opacity (0 → 1), Scale (0.9 → 1)

**CSS:**
```css
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animated-element {
  animation: fadeInScale 300ms ease-out;
}
```

### Step 10: Component Variants

If Figma has component variants:

```typescript
interface ButtonVariant {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonVariant> = ({ 
  variant, 
  size 
}) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`}>
      Click Me
    </button>
  );
};
```

```css
/* Variant styles */
.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-secondary {
  background: var(--secondary-bg);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

/* Size variants */
.btn-small {
  padding: 8px 16px;
  font-size: 10px;
}

.btn-medium {
  padding: 12px 24px;
  font-size: 12px;
}

.btn-large {
  padding: 16px 32px;
  font-size: 14px;
}
```

## Tools to Speed Up Conversion

### 1. Figma Plugins
- **Anima** - Export to React code
- **Figma to Code** - Generate HTML/CSS
- **Style Guide** - Export design tokens

### 2. Browser DevTools
- Inspect Figma's rendered CSS
- Copy computed styles
- Test responsive breakpoints

### 3. Figma Inspect Panel
- Select any element
- View CSS properties in right panel
- Copy values directly

## Best Practices

1. **Start with Layout:** Get positioning right first
2. **Use CSS Variables:** For colors and spacing
3. **Match Exact Values:** Use Figma's exact px values initially
4. **Test Responsively:** Check all breakpoints
5. **Add Interactions:** Implement hover/active states
6. **Optimize Assets:** Compress images, use SVG when possible
7. **Document Components:** Add comments linking to Figma

## Common Gotchas

### Issue: Colors look different
**Solution:** Check if Figma color has opacity. Use `rgba()` not hex.

### Issue: Spacing is off
**Solution:** Check for hidden padding/margin in Figma's constraints.

### Issue: Font looks wrong
**Solution:** Verify font is loaded. Check font-weight and line-height.

### Issue: Layout breaks on resize
**Solution:** Use flex/grid instead of absolute positioning where possible.

## Quick Workflow

1. 📋 **Copy Figma link** to component
2. 📐 **Measure** all dimensions
3. 🎨 **Extract** colors to CSS variables
4. ⚛️ **Create** React component skeleton
5. 💅 **Style** with CSS matching Figma
6. 🎭 **Add** interactions and states
7. ✅ **Test** responsiveness
8. 📝 **Document** component props

## Example: Complete Component Conversion

See `UIReact.tsx` for full examples of:
- HeartBox (simple component)
- GameButton (interactive component)
- StatsHUD (complex component with state)
- IngameMenu (component with children)

Happy coding! 🚀
