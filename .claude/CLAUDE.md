# Three Particles Editor - Projekt dokumentáció

## Projekt célja

Ez egy **particle system editor** ThreeJS-hez, Unity stílusban megvalósítva. Az editor kifejezetten a [@newkrok/three-particles](https://github.com/NewKrok/three-particles) npm csomaghoz készült, amely egy komplex konfigurációs fájlt vár paraméterként. Mivel a részecske rendszer konfigurációs fájlja kézzel nehezen szerkeszthető, ezt az editort fejlesztették ki a vizuális szerkesztés megkönnyítésére.

**Főbb jellemzők:**
- Vizuális particle effect editor ThreeJS-hez
- Unity particle rendszerre építkezik (koncepció és működés)
- JSON alapú konfiguráció export/import
- Real-time preview és szerkesztés
- Game developerek számára készült

## Technológiai stack

### Core technológiák
- **ThreeJS** (v0.175.0) - 3D renderelés és particle rendszer
- **Svelte** (v4.2.12) - UI keretrendszer
- **TypeScript** (v5.8.3) - Típusos JavaScript
- **Rollup** (v2.79.1) - Bundle tool

### Fő függőségek
- `@newkrok/three-particles` (v2.0.3) - A particle rendszer motor
- `@newkrok/three-utils` - Utility függvények
- `lil-gui` - GUI panel a paraméter szerkesztéshez
- `prismjs` - Szintaxis kiemelés (konfiguráció megjelenítéshez)

### UI könyvtárak
- **SMUI** (Svelte Material UI) komponensek:
  - Button, Card, Dialog, TextField, Tab, List, Snackbar
- **Material Theme** (@material/theme)
- **svrollbar** - Custom scrollbar

### Dev tools
- ESLint + Prettier - Kód formázás
- Husky + lint-staged - Pre-commit hooks
- Jest + ts-jest - Tesztelés
- Semantic-release - Automatikus verziózás

## Projekt struktúra

```
three-particles-editor/
├── src/
│   ├── js/
│   │   ├── three-particles-editor/        # Core editor logika
│   │   │   ├── entries/                   # Konfiguráció szekciók
│   │   │   │   ├── general-entries.ts     # Általános beállítások
│   │   │   │   ├── emission-entries.ts    # Kibocsátás paraméterek
│   │   │   │   ├── shape-entries.ts       # Emitter alakzatok
│   │   │   │   ├── velocity-over-lifetime-entries.ts
│   │   │   │   ├── color-over-lifetime-entries.ts
│   │   │   │   ├── opacity-over-lifetime-entries.ts
│   │   │   │   ├── size-over-lifetime-entries.ts
│   │   │   │   ├── rotation-over-lifetime-entries.ts
│   │   │   │   ├── noise-entries.ts       # Noise alapú animáció
│   │   │   │   ├── texture-sheet-animation-entries.ts
│   │   │   │   ├── renderer-entries.ts    # Rendering beállítások
│   │   │   │   ├── transform-entries.ts   # Pozíció, rotáció, skála
│   │   │   │   └── helper-entries.ts      # Debug és helper eszközök
│   │   │   ├── curve-editor/              # Bezier görbe szerkesztő
│   │   │   │   ├── curve-editor.ts
│   │   │   │   └── predefined-bezier-curve-config.ts
│   │   │   ├── world.ts                   # ThreeJS scene setup
│   │   │   ├── assets.ts                  # Textúra és asset kezelés
│   │   │   ├── texture-config.ts          # Textúra konfigurációk
│   │   │   ├── config-converter.ts        # Legacy konfig konverzió
│   │   │   ├── config-util.ts             # Konfig utility-k
│   │   │   ├── save-and-load.ts           # Mentés/betöltés logika
│   │   │   └── showLegacyConfigModal.ts   # Legacy konfig kezelés
│   │   ├── stores/                        # Svelte store-ok
│   │   │   └── snackbar-store.ts          # Snackbar állapot
│   │   ├── utils/                         # Utility funkciók
│   │   │   └── name-utils.ts              # Fájlnév generálás
│   │   └── three-particles-editor.ts      # Fő editor entry point
│   ├── components/                        # Svelte komponensek
│   │   ├── header/                        # Felső navigáció
│   │   ├── content/                       # Fő tartalom terület
│   │   │   ├── control-panel/             # Vezérlő gombok
│   │   │   ├── left-side/                 # Bal oldali panel
│   │   │   ├── library/                   # Textúra könyvtár
│   │   │   └── examples/                  # Példa konfigurációk
│   │   ├── config-card/                   # Konfiguráció card
│   │   ├── save-dialog/                   # Mentés dialog
│   │   ├── load-dialog/                   # Betöltés dialog
│   │   ├── legacy-config-modal/           # Legacy konfig modal
│   │   ├── about-modal/                   # About modal
│   │   └── snackbar/                      # Értesítések
│   ├── theme/                             # SMUI téma fájlok
│   └── App.svelte                         # Fő app komponens
├── public/
│   ├── assets/                            # Statikus asset-ek
│   ├── examples/                          # Példa JSON konfigok
│   ├── favicon/                           # Favicon fájlok
│   ├── lib/                               # Külső library-k
│   ├── global.css                         # Globális stílusok
│   └── index.html                         # HTML entry point
└── scripts/
    └── compile-theme.js                   # SMUI téma fordító
```

## Architektúra

### Editor inicializálás folyamata

1. **App.svelte** betöltődik és meghívja a `createParticleSystemEditor('#three-particles-editor')`
2. **ThreeJS scene** létrehozása ([world.ts](src/js/three-particles-editor/world.ts))
   - WebGL renderer setup
   - Orbit controls
   - Stats panel
   - Ground plane mesh
3. **Asset betöltés** ([assets.ts](src/js/three-particles-editor/assets.ts))
   - Beépített textúrák
   - LocalStorage-ból custom textúrák
4. **GUI panel létrehozása** (lil-gui)
   - Minden konfiguráció szekció regisztrálása (entries)
5. **Particle system létrehozása**
6. **Animation loop** indítása

### Konfiguráció rendszer

A particle system konfigurációja egy nagy JavaScript objektum, amely tartalmazza:

```typescript
{
  transform: { position, rotation, scale },
  general: { duration, looping, maxParticles, ... },
  emission: { rateOverTime, bursts, ... },
  shape: { type, radius, angle, ... },
  velocityOverLifetime: { ... },
  colorOverLifetime: { ... },
  opacityOverLifetime: { ... },
  sizeOverLifetime: { ... },
  rotationOverLifetime: { ... },
  noise: { ... },
  textureSheetAnimation: { ... },
  renderer: { material, texture, blending, ... },
  _editorData: {
    textureId: string,
    simulation: { movements, rotation, speeds },
    showLocalAxes: boolean,
    showWorldAxes: boolean,
    frustumCulled: boolean,
    terrain: { textureId, ... },
    metadata: {
      name: string,
      createdAt: number,
      modifiedAt: number,
      editorVersion: string
    }
  }
}
```

### Entry rendszer

Minden konfiguráció szekció ([entries/](src/js/three-particles-editor/entries)) egy `ConfigEntry` objektumot ad vissza:

```typescript
type ConfigEntry = {
  onReset?: () => void;                          // Új konfiguráció létrehozásakor
  onParticleSystemChange?: (ps) => void;         // Particle system újra létrehozásakor
  onAssetUpdate?: () => void;                    // Asset frissítéskor
  onUpdate?: (cycleData) => void;                // Minden frame-ben
};
```

### Particle System életciklus

1. **Létrehozás**: `createParticleSystem(config)` - @newkrok/three-particles alapján
2. **Frissítés**: `updateParticleSystems(cycleData)` - Minden frame-ben
3. **Újralétrehozás**: Konfiguráció változásakor teljes dispose + újra létrehozás
4. **Dispose**: Memória felszabadítás GPU objektumok tisztítása

### Mentés/Betöltés

- **LocalStorage**: Konfigurációk lokális mentése
- **Clipboard**: JSON konfiguráció másolása/beillesztése
- **Fájl export/import**: JSON fájl letöltése/feltöltése
- **Metadata tracking**:
  - Konfiguráció név
  - Létrehozás/módosítás időbélyegek
  - Editor verzió

### Legacy konfiguráció konverzió

A [config-converter.ts](src/js/three-particles-editor/config-converter.ts) kezeli a régebbi formátumú konfigurációk automatikus frissítését az új formátumra.

## Fontos koncepciók

### 1. Unity-like módulok

Az editor modularitása a Unity particle rendszerre épít:
- **General**: Alapvető beállítások (duration, looping, max particles)
- **Emission**: Részecskék kibocsátása (rate, bursts)
- **Shape**: Emitter alakzatok (cone, sphere, box, circle, edge)
- **Velocity Over Lifetime**: Sebesség animáció
- **Color/Opacity/Size/Rotation Over Lifetime**: Tulajdonság animációk
- **Noise**: Turbulencia hatások
- **Texture Sheet Animation**: Sprite sheet animáció
- **Renderer**: Rendering beállítások (material, blending)

### 2. Curve Editor

Bezier görbék szerkesztése az animációs értékekhez (pl. opacity/size over lifetime). Predefined preset-ekkel.

### 3. Simulation módok

Helper funkciók a teszteléshez:
- **Movement simulations**: Emitter mozgatása (circular, pendulum, etc.)
- **Rotation simulations**: Emitter forgatása
- **Axes**: Local/world tengelyek megjelenítése

### 4. Custom textúrák

Felhasználók saját textúrákat tölthetnek fel, amelyek LocalStorage-ban tárolódnak és újrafelhasználhatók.

## Fejlesztési workflow

### Parancsok

```bash
npm run dev              # Development mode (watch + hot reload)
npm run build            # Production build
npm start                # Serve production build
npm run lint             # ESLint ellenőrzés
npm run format           # Prettier formázás
npm test                 # Jest tesztek futtatása
npm run release          # Semantic release (CI)
```

### Build folyamat

1. **SMUI theme fordítás**: Light és dark témák generálása
2. **Rollup build**: TypeScript → JavaScript, Svelte → JavaScript
3. **Output**: `public/build/` mappa

### Git hooks

- **Pre-commit**: lint-staged → ESLint + Prettier automatikus javítás

### Verziózás

Semantic-release automatikusan verzióz és generál CHANGELOG-ot a conventional commits alapján.

## API (window.editor)

Az editor globális API-t biztosít a `window.editor` objektumon keresztül:

```typescript
window.editor = {
  createNew: () => void,                              // Új konfig létrehozása
  load: (config) => void,                             // Konfig betöltése
  loadFromClipboard: () => void,                      // Betöltés vágólapról
  copyToClipboard: () => void,                        // Másolás vágólapra
  reset: () => void,                                  // Particle system újraindítása
  play: () => void,                                   // Lejátszás folytatása
  pause: () => void,                                  // Lejátszás szüneteltetése
  updateAssets: () => void,                           // Asset-ek frissítése
  getCurrentParticleSystemConfig: () => config,       // Aktuális konfig lekérése
  updateConfigMetadata: (name?) => metadata,          // Metadata frissítése
  getConfigMetadata: () => metadata                   // Metadata lekérése
};
```

## Kapcsolódó projektek

- **[@newkrok/three-particles](https://github.com/NewKrok/three-particles)**: A particle rendszer motor
- **Unity Particle System**: Inspiráció és referencia

## Live demo

[https://newkrok.com/three-particles-editor/index.html](https://newkrok.com/three-particles-editor/index.html)

## Repository

[https://github.com/NewKrok/three-particles-editor](https://github.com/NewKrok/three-particles-editor)

---

## Fejlesztési megjegyzések

### Gyakori feladatok

1. **Új konfiguráció property hozzáadása**:
   - Frissíteni kell a megfelelő `entries/*.ts` fájlt
   - Hozzáadni a `getDefaultParticleSystemConfig()` default értékéhez
   - Tesztelni a particle system viselkedését

2. **Új textúra hozzáadása**:
   - `texture-config.ts`: Új TextureId enum érték
   - `assets.ts`: Textúra betöltési logika
   - `public/assets/`: Textúra fájl

3. **UI komponens módosítása**:
   - Svelte komponensek: `src/components/`
   - SMUI komponenseket használni
   - Responsive dizájn figyelembembevétele

4. **Legacy konfiguráció konverzió**:
   - `config-converter.ts`: Konverziós logika
   - Visszafelé kompatibilitás megőrzése

### Figyelendő dolgok

- **Performance**: Nagy részecskeszám esetén FPS csökkenés
- **Memory leaks**: Particle system dispose helyes kezelése
- **Browser compatibility**: WebGL support ellenőrzése
- **LocalStorage limit**: Nagy textúrák esetén quota exceeded

### Tesztelés

- Unit tesztek: Jest (`src/**/__tests__/*.test.ts`)
- Manuális tesztek: Különböző böngészőkön és eszközökön
- Performance profiling: ThreeJS stats panel

---

**Utolsó frissítés:** 2026-01-21
**Editor verzió:** 2.3.0
**@newkrok/three-particles verzió:** 2.0.3
