# Dystopia-App-Web

A custom web version of the Dystopia App game, written in HTML5 and JavaScript. This project is an 8-bit action RPG adapted for web browsers.

## Features

- **8-bit Action RPG**: Experience classic role-playing gameplay with retro graphics.
- **Web Compatibility**: Playable directly in modern web browsers without additional plugins.
- **Custom Engine**: Built using a custom game engine (LittleJS) tailored for web performance.

## Tools Used

1. LittleJS
2. Zzfx
3. Box2d physics (c++ compiled to js via emscripten)
4. Tiled Level Editor
5. Krita
6. Three JS for the 3d animation
7. Cannon-es for the 3d physics and collisions

## Getting Started

To run the game locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Sam2much96/Dystopia-App-Web.git
   cd Dystopia-App-Web

   ```

2. **Run the Build Server**:
   Check the package,json for supported commands to run for testing / building.
   Run npm run vite build --emptyOutDir to build game assets to /dist folder. Game assets stored
   in /Public are copied over to /dist for final hosting

3. **Building for ItchIO & Other Platforms**:
   Make sure that paths to assets and code are relative paths, this is `src="/assets/index-DF-xfI7b.js">` is bad and this `src="./assets/index-DF-xfI7b.js">` is good for all loaded assets in /dist/index.html

4. **Engine**

The web build of Dystopia App Uses LittleJS game Engine for 2d rendering and game Logic, Threejs for 3d rendering, ZzFx for Sound Effects and Zzfxm for Audio files playback

Game distributables are built into the dist folder which is served as the /public folder
the game fetches all assets from the /public directory in the vercel server build

5. **Plugins**
   To compile javascvript .js plugins for typescript, run `npx tsc box2d.js --declaration --allowJs --outFile box2d.js` to generate the declaration d.ts file

6. **Optimisation & Bugs**

The game runs well on PC browsers bug lags on mobile browsers. It would require optimzation
and proper memory management of code engine elements including the 3d rendering engine, the 3d level design,
the font loading also lags. There's also a periodic lag that i suspect had to do with the simulation singleton
delta time that's needed for animation. Remove unused dependencies using dep check
run `$npx depcheck ` and `$npm uninstall <unused deps>`

5. **Yandex Bugs**

The yandex build will throw errors if any external url is built into the game. also make sure your code structure's
closed in html tags
e.g.

```
<html>
<head>
...
</head>
<body>
...
</body>
</html>

```

Yandex console will throw errors unless your page is structured like this
