# 🌟 Frontend Design & Development Guide (React + Vite + Radix + Tailwind)

This document defines the **frontend design system** and development guidelines for all developers and AI tools (Copilot, Cursor, Bolt, Grok) to follow — ensuring a **beautiful, modern, accessible, and consistent UI/UX**.

---

## 📦 Tech Stack

| Layer         | Tool                                      |
|---------------|-------------------------------------------|
| Framework     | React + Vite                             |
| UI Behavior   | [Radix UI](https://www.radix-ui.com/)    |
| Styling       | TailwindCSS                              |
| Animation     | Framer Motion                            |
| Design System | Shadcn-style layering + custom styling   |
| Icons         | Lucide or Heroicons                      |

---

## 🎨 Design Language (Color Palette)

| Color Hex    | Tailwind Name | Usage                                      |
|--------------|---------------|--------------------------------------------|
| `#aa96da`    | `primary`     | Main buttons, links, highlights            |
| `#8b70cd`    | `accent`      | Hover/focus states, active UI elements     |
| `#ffffff`    | `white`       | Base backgrounds, text                     |
| `#e6e6e6`    | `neutral`     | Card backgrounds, borders, inputs          |
| `#c9bce7`    | `secondary`   | Side panels, section backgrounds           |
| `#e7e1f5`    | `soft`        | Hero backgrounds, dividers, soft fills     |

### ✅ Tailwind Config

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#aa96da',
      accent: '#8b70cd',
      neutral: '#e6e6e6',
      secondary: '#c9bce7',
      soft: '#e7e1f5',
    },
  },
},
