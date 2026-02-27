# Death Star Battles

![preview](./preview.png)

A modern JavaScript/PhaserJS port of the 2001 game **Death Star Battles**, originally created by Ian Bolland. Take control of your own space station, adjust the angle and power of your shots, and fire at your opponents. Use the gravitational pull of nearby stars and planets to your advantage, and when things get too close for comfort, activate hyperspace to jump to a random location. The last surviving station wins. Play the live version [here!](https://deathstarbattles.ca/)

## Features

- Turn-based gameplay inspired by the original **Death Star Battles**.
- Interactive controls to adjust firing angle and power.
- Gravity effects from stars and planets.

## Tech Stack

- **Phaser**: 2D game engine for rendering and physics.
- **React**: For managing UI components and controls.
- **TypeScript**: For type safety and more maintainable code.
- **Vite**: Development tooling.

## Installation

```sh
git clone https://github.com/Moai-/deathstarbattles.git
cd deathstarbattles
yarn
```

## Usage

To run a local development version:

```sh
yarn dev
```

This will launch a local server and open the game in your browser.

### Deploying to GitHub Pages

From the project root, run:

```sh
yarn deploy
```

This builds the app, then publishes the `dist` folder to the `gh-pages` branch. To use a **custom domain** (e.g. `yourname.com`), either:

- Copy `github-pages-domain.example` to `github-pages-domain` and put your domain on the first line (no `https://` or trailing slash), or  
- Set the environment variable `GITHUB_PAGES_DOMAIN` to your domain.

If you don’t set a domain, the site will use the default `*.github.io` URL.

## License

This project is licensed under the [ISC License](LICENSE).

## Credits

- Original concept and Java version by **Ian Bolland** from [the old Death Star Battles website](http://deathstarbattles.co.uk).
- Music by **Ivo de Vero**
- Sounds by **Nick Rinchiuso**
- Code by **Sergei Gmyria** [aka Moai](https://github.com/Moai-)
- Ported and modernized using React, TypeScript, and Phaser.

## Contribution

Fork & riff as you see fit.
