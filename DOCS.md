# Death Star Battles - Codebase Guide (DOCS.md)

This repo is split into two TypeScript workspaces:

- **`frontend/`** — Phaser (game runtime) + React (UI overlay), plus rendering/shaders.
- **`shared/`** — Shared ECS components/systems, AI + simulation worker, scenario generation, and general utilities/types used by the front-end. In theory, this will also be used by the back-end (if I ever get around to implementing multiplayer), as well as front-end for singleplayer (current usage). The main difference here is that nothing in this folder can access Phaser. Phaser lives purely in the front-end, this should be nothing but business logic.

---

## High-level Architecture

### Runtime layers
1. **React UI (`frontend/src/ui/`)**
   - Owns the simple app state transformations (splashscreen, game setup, game controls, scenario editor).
   - Calls into the Phaser app singleton through a deferred loader (`frontend/src/ui/deferredApp.ts`) to start/stop scenes.
   - Talks to Phaser via an event bus (`frontend/src/util/event.ts`).

2. **Phaser App + Scenes (`frontend/src/game/`)**
   - `App` (`frontend/src/game/app.ts`) is a singleton that starts/stops scenes, and owns the Phaser game object.
   - Scenes share common ECS + render plumbing via `BaseScene`.
   - Three other scenes are derived from the base:
     - `BackgroundScene`: automatic bot-vs-bot gameplay on the main menu.
     - `GameScene`: single-player game vs bots.
     - `EditorScene`: used by the scenario editor.
  - There is also `ResourceScene`, which is currently used only for sound management.

3. **ECS (`shared/src/ecs/`)**
   - BitECS implementation of ECS architecture ([see Wikipedia page](https://en.wikipedia.org/wiki/Entity_component_system) for more info on ECS).
   - Defines world, components, systems, and entity templates.

4. **Rendering (`frontend/src/render/`)**
   - `animations`: renderable animations.
   - `background`: background art - elements, templates (composed of elements) and helpers.
   - `components`: FE-only components used by the render system.
   - `debug`: elements helpful for debugging and development.
   - `elements`: specific renderable elements used by objects and background art.
   - `managers`: classes controlling different kinds of renders.
     - `EntityRenderManager` is used by the `renderSystem` and other game components to render, remove, and update Phaser objects.
     - `BackgroundArtManager` is used by game managers to render, track, and remove background art.
   - `objects`: rendering methods for the different objects the game can display.
   - `renderSystem`: ECS system responsible for tracking when renderable entities enter and leave the world, and updating their renders.

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
  - `BaseGameManager`: owns turn loop (turn selection, input/bot turn generation, fire, cleanup).
  - `SinglePlayerGameManager`: extends base game to add human input phase.
  - `EditorManager`: editor interactions (place/move objects, click selection, test-firing, etc.).
  - `fxManager`: postprocessing shader orchestration.
  - `handlers/`: input + firing indicator + collision handler glue.

### `frontend/src/ui/`
React overlay for menus, setup, in-game controls, and editor windows.
- `components/context.tsx` is the UI state machine; it starts/stops Phaser scenes via `App`.
- `components/editor/*` is the editor UI (selection menus, inspect windows, firing panel, options).

### `shared/src/ai/`
- `generateTurn.ts`: bot decision making entrypoint.
- `simulation/*`: worker-based shot simulation (snapshot + sim.worker).
- `difficulties/*`: tuning per bot difficulty.

### `shared/src/content/`
- `consts/*`: constants to help with entity creation.
- `entities/*`: entity creation templates (after creating an entity, add and pre-configure components).
- `scenarios/*`: scenario generation templates and code.
- `objectManifest.ts`: associates in-game objects with their types, user-readable names, and entity templates.

### `shared/src/ecs/`
- `components/*`: SoA typed-array components (Position, Collision, HasGravity, Wormhole, etc.).
- `serde/*`: serialize / deserialize game world.
- `systems/*`: movement/gravity/jets/collision/cleanup/path tracking.
- `world.ts`: create, provision, and reset ECS world.

### `shared/src/types/`
- types used across the entire app, usually ones that need to be shared between ai/ecs and Phaser.

### `shared/src/utils/`
- Broad-strokes utilities used across the project.
- Includes polyfill functions from Phaser, colour utilities, position and entity helpers.

---

## How the App Runs

### React -> Phaser
- UI state changes in `frontend/src/ui/components/context.tsx`.
- That triggers `App.startMode(...)` / `App.stopMode(...)` and uses `gameBus` events for coordination.

### Phaser Scene lifecycle
- ECS World is created.
- ECS Systems are set up.
- Listeners are activated.
- Managers are provisioned and initialized.
- An event is sent out to signify that the scene is ready to go (`GameEvents.SCENE_LOADED`).
- On scene update, every ECS system is updated.
- Each scene exposes/overrides `.destroy()`, which should undo everything done before:
  - ECS systems are gracefully shut down.
  - Listeners are deactivated.
  - Each manager's `.destroy()` method is called.
  - ECS world is reset.
  - An event is sent out to signify that the scene is unloaded (`GameEvents.SCENE_UNLOADED`).

### Game loop
- See `baseGameManager` for details.
- **Start phase:**
  - Wait for 1 second to start turn, for pacing.
  - Check whether the game has concluded (more than one player remaining).
- **Player turn:**
  - Turns are not, strictly speaking, per-player, but are actually per player station.
  - If the player is dead, they end their turn.
  - If the current active station is dead, it ends its turn.
  - Otherwise, either collect input (if human player) or generate turn input (if bot).
- **End player turn:**
  - Move to the next station or player to collect input.
  - If this is the last station, move to Fire Phase.
- **Fire phase:**
  - Everyone who provided firing input information fires their weapons.
  - If no one fired (i.e. everyone teleported), we move to the post-combat phase.
  - Otherwise, we listen to when every active element (i.e. projectiles) has been resolved, and then move to the post-combat phase.
- **Post-combat phase:**
  - Execute teleport for everyone who chose to teleport.
  - Update the simulation webworker with new game state.
  - Move to start phase.


### Editor loop
- Add various entities to the scene using the `add` menu.
- Clicking the entity shows options. Inspecting an entity allows you to edit the various properties of the entity.
- Test out your scenario by adding a death star (or multiple ones). Clicking a death star allows you to fire a projectile. In the `options` menu, you can disable destruction for death stars.
- Add a background through the `options` menu. Clicking the same background again generates a new one. 
  - Note: currently, seeds are not supported, so all you can really select is the background generation template. Playing your scenario won't show the same background as in your editor.
- Save the scenario using the save function in `options`. Death stars and projectiles will not be saved. 
- You can play a full game with bots in a scenario you made by selecting the "Saved Scenarios" tab and picking your scenario from the dropdown.

---

## DevOps

### Chunking

The app is chunked into smaller, logical pieces (see `frontend/vite.config.mts` for chunk definitions) in order to improve loading times. Loading should roughly occur in the following steps:

  1. `react-vendor`: React and React-DOM load first.
  2. `ui-vendor`: Miscellaneous UI libraries load.
  3. `ui-app`: The game's UI, written in React, is loaded. At this point, the page can show.
  4. `other-vendor`: Non-UI libraries load.
  5. `phaser-core`: Phaser core modules load (see "Phaser Custom Build" section for details).
  6. `phaser-extras`: Additional Phaser modules are loaded.
  7. `game-app`: Main game code is loaded. At this point, the background game can launch.

So, there are two key parts to loading: steps 1-3 and steps 4-7. Steps 1-3 involve loading significantly smaller bundles than the rest of the code (accounting for about 15% of the total bundle size), and it's the main UI, so it should load first. Steps 4-7 load Phaser-specific code, and the game is ready to play after they are done loading.

In order to actually separate these two parts, async imports were implemented. The two worlds of React and Phaser touch through three key files:

  1. `frontend/src/game/app.ts`: creates the Phaser instance, starts/stops scenes.
  2. `frontend/src/ui/deferredApp.ts`: asynchronously loads the above app, and exposes its methods to React.
  3. `frontend/src/ui/components/context.tsx`: calls methods on the deferred app wrapper from inside React.

Because no static imports in the React part exist to import anything in the Phaser part, we can load and fully start React before Phaser. React is free to call methods on the deferred app wrapper, because all those methods are async, resolving only when Phaser is loaded, and calling the underlying methods on the App singleton. 

### Phaser Custom Build

Phaser ships with a pretty enormous codebase. Before implementing a custom build, the total size of the game was 1.8mb, of which 1.4mb was Phaser. But it turns out that there are a lot of modules included by default that you might not even need to use. This is a known problem, and the solution is to use a Phaser [custom build](https://github.com/phaserjs/custom-build), where you can select specific modules and include only those modules for your build. The custom build lives in `frontend/vendor/phaser-custom`, and the specific modules are selected inside the two phaser entry files in that directory. 

I whittled down all of the unnecessary modules, only to find that the minimum viable build was still ~800kb. I felt this was too big to load in a single chunk (plus, rollup complained), and as a result, I split the build into two chunks:
  - `phaser-core` contains only a couple packages; the `core` module itself is the biggest.
  - `phaser-extras` should, in theory, contain non-essential packages; in practice, some (like `core/game`) are also essential.

So, in spite of their names, a better way to understand these aren't the essential `core` and the subservient `extras`, but it's more like `phaser-part-1` and `phaser-part-2`, both mixing together modules of various importances, and only being split this way in order to keep individual chunk size under 500kb. 

Splitting the phaser build into these two halves led to some difficulties: 

  - The packages build on each other. The first assigns itself to a global Phaser namespace, and the second extends that namespace. Because of this behaivour, it is important to import them in order. Importing them out of order extras to write its modules to an uninitialized namespace, and then core loads and overwrites that namespace, so everything you'd expect to come from extras will be missing. 
  - Typescript can cope normally with a custom Phaser build, but because I split it in two, it got confused. That is why I added the `frontend/src/typings` folder. Removing this folder will not affect the build or the runtime, but the VSCode Typescript server goes nuts and starts highlighting all sorts of things, so these are there mostly for development comfort. The files inside are:
    - `phaser-chunks.d.ts` lets Typescript know that there are two Phaser chunks.
    - `phaser-global.d.ts` tells Typescript where to get type definitions for the Phaser namespace.
  
The custom Phaser build is only beneficial for deployment. During development, it is better to have the full Phaser library available. In order to gain access to the full Phaser library, see the comment at the top of `frontend/src/game/app.ts`. Then, if you used some new modules that were not present in the custom build, you will need to add them to it. If they're small, you can add these new modules to one of the two existing chunks. If adding new modules leads to a chunk bigger than 500kb, you can add a new chunk with the following steps:

  1. Create a new entrypoint file (for example, `frontend/vendor/phaser-custom/phaser-physics.js`). You can use `phaser-extras` as a starting point.
  2. Add your modules to this new entrypoint file.
  3. Check `frontend/vendor/phaser-custom/webpack.config.js` and add two new entries for the entrypoint file under `entry` (one for `.min.js` and one for the import and depend); set it to depend on `phaser-extras`.
  4. By this point, it should be possible to build the custom Phaser build with no errors.
  5. Go to `frontend/vite.config.mts` and make the following changes:
    - Add a new alias for the package under `resolve/alias`
    - Add a new chunk under `build/rollupOptions/output/manualChunks`
  6. Go to `frontend/src/typings/phaser-chunks.d.ts` and add a line for the new chunk.
  7. Go to `frontend/tsconfig.json` and add a path alias under `compilerOptions/paths`.
  8. Go to `frontend/src/ui/deferredApp.ts` and async import the chunk inside `loadApp`.
  9. Go to `frontend/src/game/app.ts` and static import the new chunk at the top of the file.
  10. Make sure you've built the custom Phaser build. Now, building the whole repo should work, and running the game in dev mode should work too.

### Deployment
In its current state, the game does not feature a back-end, and is intended to be deployed on a GitHub Pages site. After making sure that your fork has GitHub Pages enabled, simply run `yarn deploy` in the root directory. If you have a custom domain you will be serving the app from, create a root-level file called `github-pages-domain` and specify your custom domain there. This allows the script to generate a CNAME file, which is important for the GH Pages deployment to work properly with custom domains.

---

## Where to Look for Common Tasks

- **Add a new level object (new kind of star, planet, etc)**
  - Add to `ObjectTypes` (shared types).
  - Add ECS components/factory in `shared/src/content/entities/`.
  - Add renderer in `frontend/src/render/objects/`.
  - Add to object manifest in `shared/src/content/objectManifest`.
  - Add to scenario templates in `frontend/src/content/scenarios/`.

- **Change physics**
  - ECS systems in `shared/src/ecs/systems/`.
  - `gravity.ts` is probably the place to start for gravity-related physics.
  - `movement.ts` is much simpler, but can be tweaked too -- try changing the `slow` ratio!

- **Adjust AI**
  - `shared/src/ai/generateTurn.ts` and `shared/src/ai/difficulties/*`.
  - Each difficulty type has its own ways of generating turns.
  - Higher difficulties will simulate some shots before deciding on a shot.

- **Change background visuals**
  - `frontend/src/render/background/*`.
  - Add a generator in the `generators` folder -- this is what draws the background image.
  - Register the new generator in the `generators/index` file, and in the `Backgrounds` enum.
  - Add to scenario templates in `frontend/src/content/scenarios/` (if new).

---

## Notes / Conventions

- Most game logic is in managers (turn flow), while physics are handled in ECS systems.
- Managers contain heavy business logic for a given domain. ECS systems are intended to be small and lightweight.
  - For example, the collision system will detect when a projectile has collided with something, whether it was destructible or not, etc. It sets the appropriate flags or changes property values in ECS components, and might fire an event.
  - A heavier manager's method will be called from inside the ECS system, or maybe that manager would be listening to an event that the ECS system fired. In this case, the system detects that there was a collision between a death star and a projectile, and runs a manager method to handle the explosion that takes place after that point.

