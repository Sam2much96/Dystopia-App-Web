# React UI Migration Guide

## Overview
This guide helps you migrate from the legacy DOM manipulation UI system to modern React components.

## Installation

First, ensure React and ReactDOM are installed:

```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

## File Structure

```
src/
├── UI.ts (legacy - keep for reference)
├── UIReact.tsx (new React components)
├── UIReact.css (new React styling)
└── main.ts (update to use React UI)
```

## Step 1: Update your HTML

Make sure your `index.html` has the UI root element:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dystopia Game</title>
  <!-- Add the React CSS -->
  <link rel="stylesheet" href="./UIReact.css">
</head>
<body>
  <!-- UI Root for React -->
  <div id="ui-root"></div>
  
  <!-- Your game canvas -->
  <canvas id="game-canvas"></canvas>
  
  <script type="module" src="./main.ts"></script>
</body>
</html>
```

## Step 2: Update Global Window Interface

Add to your `globals.d.ts` or type definitions:

```typescript
import { UIReact } from './UIReact';

declare global {
  interface Window {
    ui: UIReact;
    // ... existing globals
    music: Music;
    dialogs: DialogBox;
    globals: Globals;
    player: Player;
    inventory: Inventory;
    wallet: Wallet;
    quest: Quest;
    // ... etc
  }
}
```

## Step 3: Initialize React UI

Update your main game initialization:

```typescript
// main.ts or wherever you initialize your game

import { UIReact } from './UIReact';
import './UIReact.css';

// Replace the old UI initialization
// OLD: window.ui = new UI();
// NEW:
window.ui = new UIReact();

// Initialize the React UI after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ui.initialize();
});
```

## Step 4: Migration Strategy (Gradual Migration)

You can migrate gradually by keeping both systems running:

```typescript
import { UI } from './UI'; // legacy
import { UIReact } from './UIReact'; // new

// Keep legacy for now
window.legacyUI = new UI();

// Initialize React UI
window.ui = new UIReact();
window.ui.initialize();

// Gradually migrate features:
// 1. Comment out old menu() call
// window.legacyUI.menu(); // OLD

// 2. React menu is automatically rendered
// ✓ React MenuButton is now active

// 3. Test and remove old code
```

## Step 5: Update Game Logic

### HeartBox Updates

OLD:
```typescript
window.ui.HeartBoxHUD?.heartbox(playerHealth);
```

NEW:
```typescript
// The React component automatically updates when window.globals.hp changes
// Just update the global:
window.globals.hp = playerHealth;
```

### Menu Visibility

OLD:
```typescript
window.ui.GameMenu!!.MenuVisible = !window.ui.GameMenu!!.MenuVisible;
```

NEW:
```typescript
// The React component manages its own state
// You can still trigger it via the menu button click
// Or expose a method if needed:
window.ui.toggleMenu();
```

### Stats HUD

OLD:
```typescript
window.ui.StatsHUD!!.InventoryVisible = !window.ui.StatsHUD!!.InventoryVisible;
```

NEW:
```typescript
// Managed by React state automatically
// Triggered by button clicks in the GameHUD component
```

## Step 6: Translation Integration

The React UI maintains compatibility with your translation system:

```typescript
// Translations work the same way
await window.ui.translateUIElements('ja_JP');

// All elements with data-i18n attributes will be translated
```

## Component Architecture

### GameUIContainer (Root Component)
- Manages all UI state
- Coordinates between components
- Handles game integration

### Individual Components
1. **HeartBox** - Health display
2. **MenuButton** - Toggle main menu
3. **GameHUD** - Action buttons (stats, item, dialog)
4. **StatsHUD** - Stats display with tabs
5. **StatsTabs** - Tab navigation
6. **IngameMenu** - Main game menu
7. **Controls** - Settings and controls

## Benefits of React Migration

### 1. Declarative UI
```typescript
// OLD: Imperative DOM manipulation
const button = document.createElement("button");
button.className = "menu-btn";
button.addEventListener("click", handler);
document.body.appendChild(button);

// NEW: Declarative React
<MenuButton onClick={handler} />
```

### 2. State Management
```typescript
// React manages state automatically
const [visible, setVisible] = useState(false);

// No more manual classList manipulation
// if (visible) element.classList.remove("hidden");
```

### 3. Component Reusability
```typescript
// Easy to reuse and compose
<GameHUD
  onStatsClick={handleStats}
  onItemClick={handleItem}
  onDialogClick={handleDialog}
/>
```

### 4. Better Performance
- Virtual DOM diffing
- Only re-renders changed components
- No manual DOM manipulation overhead

## Customization

### Adding New Components

```typescript
// Create a new component in UIReact.tsx
interface MyComponentProps {
  data: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ data }) => {
  return (
    <div className="my-component">
      {data}
    </div>
  );
};

// Add to GameUIContainer
<MyComponent data="Hello" />
```

### Styling

All styles are in `UIReact.css`. Use CSS variables for consistency:

```css
.my-component {
  background: var(--primary-bg);
  color: var(--text-primary);
  border: 2px solid var(--accent-color);
}
```

## Testing Checklist

- [ ] Menu button toggles menu
- [ ] Stats button shows/hides stats HUD
- [ ] Tab buttons switch between views
- [ ] HeartBox displays correct health
- [ ] Translations work for all elements
- [ ] New game starts correctly
- [ ] Continue game loads correctly
- [ ] All buttons play sounds
- [ ] Mobile/responsive layout works
- [ ] Game pause on menu open works

## Common Issues

### Issue: Components not rendering
**Solution:** Make sure React root is initialized after DOM loads

### Issue: Styles not applying
**Solution:** Import UIReact.css in your main entry file

### Issue: Global variables undefined
**Solution:** Ensure proper initialization order:
1. Initialize singletons (music, dialogs, etc.)
2. Initialize UIReact
3. Call ui.initialize()

### Issue: Translations not working
**Solution:** Ensure translations load before UI initialization:
```typescript
await waitForTranslations();
window.ui.initialize();
```

## Performance Optimization

### 1. Memoization
```typescript
import { memo } from 'react';

export const HeartBox = memo(({ heartCount }) => {
  // Only re-renders when heartCount changes
});
```

### 2. Use Callbacks
```typescript
const handleClick = useCallback(() => {
  // Stable callback reference
}, [dependencies]);
```

### 3. Lazy Loading
```typescript
const Controls = lazy(() => import('./Controls'));

<Suspense fallback={<div>Loading...</div>}>
  <Controls />
</Suspense>
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Copy UIReact.tsx and UIReact.css to your project
3. ✅ Update HTML with UI root element
4. ✅ Initialize React UI in main.ts
5. ✅ Test basic functionality
6. ✅ Gradually remove legacy UI code
7. ✅ Add custom components as needed
8. ✅ Polish styling with Figma references

## Support

For issues or questions about the migration, refer to:
- React Documentation: https://react.dev
- TypeScript React: https://react-typescript-cheatsheet.netlify.app
- Your existing UI.ts for reference

## Figma Integration Tips

When implementing designs from Figma:

1. **Export Assets:** Export icons, backgrounds as SVG/PNG
2. **Copy CSS:** Use Figma's "Copy as CSS" for exact styling
3. **Colors:** Use CSS variables for theme consistency
4. **Typography:** Match font sizes, weights, and spacing
5. **Animations:** Use Figma's prototype animations as reference

Example workflow:
```typescript
// 1. Get exact measurements from Figma
// 2. Create component with those specs
export const FigmaButton: React.FC = () => {
  return (
    <button style={{
      width: '64px',      // From Figma
      height: '64px',     // From Figma
      borderRadius: '12px', // From Figma
      // ... etc
    }}>
      Click Me
    </button>
  );
};

// 3. Move to CSS for reusability
```
