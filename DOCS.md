# Death Star Battles — Codebase Guide (DOCS.md)

This repo is split into two TypeScript workspaces:

- **`frontend/`** — Phaser (game runtime) + React (UI overlay), plus rendering/shaders.
- **`shared/`** — Shared ECS components/systems, AI + simulation worker, and general utilities/types used by the frontend. In 

---

## High-level Architecture

### Runtime layers
1. **React UI (`frontend/src/ui/`)**
   - Owns the “app state machine” (main menu → setup → game → score → editor).
   - Calls into the Phaser app singleton (`frontend/src/game/app.ts`) to start/stop scenes.
   - Talks to Phaser via an event bus (`frontend/src/util/event.ts`).

2. **Phaser App + Scenes (`frontend/src/game/`)**
   - `App` (`frontend/src/game/app.ts`) is a singleton that starts/stops scenes.
   - Scenes share common ECS + render plumbing via `BaseScene`.

3. **ECS (`shared/src/ecs/`)**
   - BitECS world (`shared/src/ecs/world.ts`) and components/systems (`shared/src/ecs/components`, `shared/src/ecs/systems`).
   - Runs the simulation (movement → gravity → jets → collision → render), every frame.

4. **Rendering (`frontend/src/render/`)**
   - Render components (SoA typed arrays) + `renderSystem` observers.
   - Object renderers per type (e.g. `frontend/src/render/objects/star.ts`).
   - Background generation (`frontend/src/render/background/*`).
   - Shaders/pipelines (`frontend/src/shaders/*`).

5. **AI + Simulation (`shared/src/ai/`)**
   - Turn generation logic and difficulty implementations.
   - A web-worker simulation pipeline (snapshot / sim.worker) so bots can evaluate shots without blocking the main thread.

---

## Key Directories

### `frontend/src/game/`
- **`app.ts`**
  - Owns Phaser lifecycle.
  - Provides `App.startMode(mode, config?)` and `App.stopMode(mode)`.
- **`scenes/`**
  - `BaseScene`: creates the ECS world, registers components, runs systems in `update`.
  - `GameScene`: playable game; creates a `SinglePlayerGameManager`.
  - `EditorScene`: editor mode; creates an `EditorManager`.
  - `BackgroundScene`: screensaver/attractor mode.
  - `ResourceScene`: sound/assets.
- **`managers/`**
  - `BaseSceneManager`: shared “game tools” for scenes (input handler, indicator, projectile manager, collision handler, sim manager).
  - `BaseGameManager`: owns turn loop (turn selection → input/bot → fire → cleanup).
  - `SinglePlayerGameManager`: adds human input phase.
  - `EditorManager`: editor interactions (place/move objects, click selection, test-firing, etc.).
  - `fxManager`: postprocessing shader orchestration.
  - `handlers/`: input + firing indicator + collision handler glue.
- **`gameSetup/`**
  - Random game generation:
    - `genPlayers.ts`: create players + stations (death stars).
    - `genObjects.ts`: generate scenario objects based on rules/templates.
    - `placeEntities.ts`: positions everything without overlap.
    - `finalize.ts`: post-pass (wormhole pairing/scramble, background selection, station inflation).

### `frontend/src/entities/`
Factory functions that create ECS entities for each `ObjectTypes` entry.
- `createDeathStar()` also creates and wires the pooled projectile entity.
- `createRandom[...]()` maps `ObjectTypes` → “random instance” factories (used by editor placement and scenario generation).

### `frontend/src/ui/`
React overlay for menus, setup, in-game controls, and editor windows.
- `components/context.tsx` is the UI state machine; it starts/stops Phaser scenes via `App`.
- `components/editor/*` is the editor UI (selection menus, inspect windows, firing panel, options).

### `shared/src/ecs/`
- `world.ts`: `createGameWorld(...)` and `clearWorld(...)`.
- `components/*`: SoA typed-array components (Position, Collision, HasGravity, Wormhole, etc.).
- `systems/*`: movement/gravity/jets/collision/cleanup/path tracking.

### `shared/src/ai/`
- `generateTurn.ts`: bot decision making entrypoint.
- `simulation/*`: worker-based shot simulation (snapshot + sim.worker).
- `difficulties/*`: tuning per bot difficulty.

### `shared/src/utils/`
- ECS utilities (`getPosition`, `setPosition`, `pairWormholes`, etc.).
- Random helpers and color helpers.
- `component.ts` contains `serializeComponents(...)` used by the editor UI.

---

## How the App Runs

### React → Phaser
- UI state changes in `frontend/src/ui/components/context.tsx`.
- That triggers `App.startMode(...)` / `App.stopMode(...)` and uses `gameBus` events for coordination.

### Phaser Scene lifecycle
- Each scene extends `BaseScene`:
  - World created once: `createGameWorld([...sysComponents, ...renderComponents])`.
  - Each frame: movement → path tracker → gravity → jets → collision → render → FX.

### Game loop
- `GameScene` owns a `SinglePlayerGameManager` which extends `BaseGameManager`.
- `BaseGameManager.startGame(config)` currently calls `runGameSetup(...)` to generate a world from templates/rules.
- Then turns proceed station-by-station, bots use the sim worker to choose shots, projectiles are fired, collision/cleanup systems resolve, and the loop repeats.

### Editor loop
- `EditorScene` owns an `EditorManager`.
- Editor supports selecting entities (click) and placing/moving objects.
- The editor UI receives entity payloads via `serializeComponents(world, eid)`.

---

## Where to Look for Common Tasks

- **Add a new object type**
  - Add to `ObjectTypes` (shared types).
  - Add ECS components/factory in `frontend/src/entities/`.
  - Add renderer in `frontend/src/render/objects/`.
  - Add to scenario templates in `frontend/src/content/scenarios/`.

- **Change physics**
  - ECS systems in `shared/src/ecs/systems/`.

- **Adjust AI**
  - `shared/src/ai/generateTurn.ts` and `shared/src/ai/difficulties/*`.

- **Change background visuals**
  - `frontend/src/render/background/*`.

---

## Notes / Conventions

- Most “game logic” is in managers (turn flow), while “physics” is in ECS systems.
- Rendering is event/observer driven: ECS state mutates typed arrays; render system syncs display objects.
- The editor currently serializes entities for inspection, but does not have a full “scenario save/load” pipeline yet.

