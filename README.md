# ASYNC RACE

**Live demo:** https://async-race-dusky.vercel.app/
**Score:** <390 / 400>



## ✅ Checklist

### Basic Structure (80 pts)
- [+] Two Views (Garage & Winners) — 10
- [+] **Garage** view shows: title, create/edit panel, race panel, garage list — 30
- [+] **Winners** view shows: title, winners table, pagination — 10
- [+] Persistent state on navigation (page/inputs preserved) — 30

### Garage View (90 pts)
- [+] CRUD for car (name, color) & delete removes from winners — 20
- [+] Color picker — 10
- [+] Random 100 cars (name parts + random color) — 20
- [+] Update / Delete buttons near each car — 10
- [+] Pagination (7 per page) — 10
- [+] EXTRA: Empty garage message — 10
- [+] EXTRA: Move to previous page when last item deleted — 10

### Winners View (50 pts)
- [+] Winner appears/updates after race — 15
- [+] Pagination (10 per page) — 10
- [+] Table: №, image, name, wins, best time (best time is min) — 15
- [+] Sorting by wins/best time ASC/DESC — 10

### Race (170 pts)
- [+] Start engine animation — 20
- [+] Stop engine animation — 20
- [+] Responsive animation (≥ ~500px) — 30
- [+] Start Race (all cars on page) — 10
- [+] Reset Race — 15
- [+] Winner announcement overlay — 5
- [+] Button states (disable in proper modes) — 20
- [+] Safe actions during race (edit/delete/page switch) — 50

### Tooling (10 pts)
- [+] Prettier setup — 5
- [+] ESLint (Airbnb/strict TS) — 5




## 🛠 How to run locally

```bash
npm install
echo VITE_API_URL=http://127.0.0.1:3000 > .env.local
npm run dev







































<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
``` -->
