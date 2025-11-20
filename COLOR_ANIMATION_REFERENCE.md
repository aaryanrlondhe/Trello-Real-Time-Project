# 🎨 UI/UX Color & Animation Reference

## Color Palette

### Primary Colors
```
Purple        #667eea  RGB(102, 126, 234)   - Main accent, trust & calm
Dark Purple   #764ba2  RGB(118, 75, 162)    - Depth & secondary
Pink/Magenta  #f093fb  RGB(240, 147, 251)   - Vibrant accent
Red/Pink      #f5576c  RGB(245, 87, 108)    - Error & delete
Blue          #4facfe  RGB(79, 172, 254)    - Secondary accent
Cyan          #00f2fe  RGB(0, 242, 254)     - Tertiary accent
```

### Gradients Used

1. **Primary Gradient (Buttons, Badges)**
   ```css
   linear-gradient(135deg, #667eea, #764ba2)
   ```

2. **Pink Gradient (Create, New Actions)**
   ```css
   linear-gradient(135deg, #f093fb, #f5576c)
   ```

3. **Danger Gradient (Error, Delete)**
   ```css
   linear-gradient(135deg, #f5576c, #e84060)
   ```

4. **Background Gradient (Main Background)**
   ```css
   linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)
   ```

5. **Hover Gradient (Button Hover)**
   ```css
   linear-gradient(135deg, #764ba2, #f093fb)
   ```

6. **Accent Gradient (Top Borders)**
   ```css
   linear-gradient(90deg, #667eea, #f093fb, #4facfe)
   ```

7. **Scrollbar Gradient**
   ```css
   linear-gradient(135deg, #667eea, #f093fb, #4facfe)
   ```

---

## Animation Library

### Entrance Animations

#### fadeIn (0.8s ease-out)
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Used for: Containers, main sections */
```

#### slideInLeft (0.6s ease-out)
```css
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
/* Used for: Left-aligned elements, titles */
```

#### slideInRight (0.6s ease-out)
```css
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
/* Used for: Right-aligned elements, status */
```

#### slideInDown (0.8s ease-out)
```css
@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Used for: Top containers, headers */
```

#### slideInUp (0.5s ease-out)
```css
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Used for: Form actions, buttons */
```

#### scaleIn (0.4-0.5s ease-out)
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
/* Used for: Forms, modal-like elements */
```

### Continuous Animations

#### bounce (2s ease-in-out infinite)
```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}
/* Used for: Bouncing icons and emojis */
```

#### pulse (2s ease-in-out infinite)
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
/* Used for: Status badges, indicators */
```

#### glow (2s ease-in-out infinite)
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 10px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 25px rgba(240, 147, 251, 0.6); }
}
/* Used for: Hover effects, focus states */
```

#### shimmer (3s linear infinite)
```css
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
/* Used for: Gradient sweeps, shine effects */
```

#### spin (1s linear infinite)
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* Used for: Loading spinners */
```

#### gradientShift (20s ease infinite)
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
/* Used for: Animated background gradient */
```

#### shake (0.5s ease-in-out)
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
/* Used for: Error messages */
```

#### ripple (2s infinite)
```css
@keyframes ripple {
  0% { opacity: 0; transform: scale(1); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: scale(2); }
}
/* Used for: Connection status ripple */
```

#### pulse-success (2s infinite)
```css
@keyframes pulse-success {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(102, 126, 234, 0.7);
  }
}
/* Used for: Connected status indicator */
```

#### pulse-error (2s infinite)
```css
@keyframes pulse-error {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 10px rgba(245, 87, 108, 0.5);
  }
  50% { 
    transform: scale(0.9);
    box-shadow: 0 0 15px rgba(245, 87, 108, 0.7);
  }
}
/* Used for: Disconnected status indicator */
```

---

## Hover Effect Patterns

### Button Hover Pattern
```css
&:hover {
  transform: translateY(-3px);        /* Lift effect */
  box-shadow: 0 8px 25px rgba(...);   /* Enhanced shadow */
  background: linear-gradient(...);   /* Gradient shift */
  
  &::before {
    left: 100%;                       /* Shine sweep */
  }
}
```

### Card Hover Pattern
```css
&:hover {
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
  transform: translateY(-3px);
  
  &::before {
    opacity: 1;                       /* Show accent */
  }
}
```

### List Hover Pattern
```css
&:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}
```

---

## Shadow Effects

### Light Shadow
```css
box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
```

### Medium Shadow
```css
box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
```

### Heavy Shadow
```css
box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25);
```

### Glow Shadow
```css
box-shadow: 0 0 20px rgba(240, 147, 251, 0.6);
```

### Inset Glow
```css
box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
```

---

## Timing Functions

```css
/* Easing curves used */
ease-out: cubic-bezier(0, 0, 0.2, 1)        /* Smooth entrance */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)   /* Smooth bounce */
cubic-bezier(0.4, 0, 0.2, 1)                /* Professional timing */
linear                                       /* Smooth rotation */
```

---

## Component-Specific Colors

### Header
- Background: `rgba(255, 255, 255, 0.15)` with blur
- Text: `#ffffff`
- Shadow: `rgba(102, 126, 234, 0.15)`

### Buttons
- Primary: `linear-gradient(135deg, #667eea, #764ba2)`
- Hover: `linear-gradient(135deg, #764ba2, #f093fb)`
- Create: `linear-gradient(135deg, #f093fb, #f5576c)`
- Delete: `linear-gradient(135deg, #f5576c, #e84060)`

### Input Fields
- Border: `rgba(102, 126, 234, 0.2)`
- Focus Border: `#667eea`
- Focus Shadow: `0 0 0 4px rgba(102, 126, 234, 0.2)`
- Background: `rgba(255, 255, 255, 0.9)`

### Cards
- Background: `white`
- Border: `2px solid transparent`
- Accent Bar: `linear-gradient(90deg, #667eea, #f093fb, #764ba2)`
- Shadow: `0 4px 15px rgba(102, 126, 234, 0.1)`

### Lists
- Background: `rgba(255, 255, 255, 0.9)`
- Border: `1px solid rgba(255, 255, 255, 0.3)`
- Top Accent: `linear-gradient(90deg, #667eea, #f093fb, #4facfe)`
- Drag-Over: `rgba(102, 126, 234, 0.1)` with dashed border

### Status Indicator
- Connected: `linear-gradient(135deg, #667eea, #764ba2)`
- Disconnected: `linear-gradient(135deg, #f5576c, #f093fb)`
- Glow (Success): `rgba(102, 126, 234, 0.5)`
- Glow (Error): `rgba(245, 87, 108, 0.5)`

---

## Usage Examples

### Apply Purple Gradient Button
```css
background: linear-gradient(135deg, #667eea, #764ba2);
```

### Apply Hover Lift
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
&:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
}
```

### Apply Glass Effect
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Apply Entrance Animation
```css
animation: fadeIn 0.8s ease-out;
```

### Apply Hover Glow
```css
&:hover {
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}
```

---

## Mobile Considerations

- All animations are smooth on 60fps capable devices
- Touch targets are 48px minimum
- Hover effects have fallback for touch devices
- Gradient backgrounds render efficiently
- Animations use GPU acceleration

---

## Performance Tips

✅ Use `transform` for animations (not `left/top`)
✅ Use `opacity` for fading (not color changes)
✅ Combine animations with `animation-delay` for sequence
✅ Use `will-change` on frequently animated elements
✅ Use `backdrop-filter` sparingly (performance impact)

---

This reference covers all colors and animations used in the new UI/UX design!
