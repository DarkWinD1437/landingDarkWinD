# Landing — DarkWinD

## Cardumen de cursores (activar / desactivar)

Al entrar, tres cardúmenes de cursores de mouse nadan por la pantalla y **construyen cada componente** de la landing mientras se hace scroll (cada uno con su borde y su tamaño en píxeles). Al terminar, nadan unos segundos y salen de la pantalla.

**Interruptor principal:** `SWARM_ENABLED` en [`src/components/swarm/config.ts`](src/components/swarm/config.ts).

| Valor | Resultado |
| --- | --- |
| `true` | Los cursores construyen la página. |
| `false` | La página se muestra normal e inmediatamente, con las animaciones de entrada originales (tarjetas que se deslizan o hacen zoom). |

Se puede sobrescribir **sin tocar el código** (de mayor a menor prioridad):

1. **URL:** `https://tu-sitio/?swarm=off` (o `=on`), útil para probar.
2. **Variable de entorno:** `VITE_SWARM=off` (o `on`), por despliegue (p. ej. en Netlify).
3. **La constante** `SWARM_ENABLED`.

Valores aceptados: `on`/`off`, `true`/`false`, `1`/`0`, `yes`/`no`. Con *reducir movimiento* activado en el sistema, el cardumen no corre nunca.

Con el cardumen apagado se conservan las correcciones de rendimiento y de móvil (typewriter aislado, componentes `motion` cacheados, sin desbordamiento horizontal ni "zoom out" en celulares).

Para marcar un componente nuevo como "construible" basta con añadirle `data-build="ETIQUETA"`; la etiqueta es el nombre que aparece junto al tamaño en su borde.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
