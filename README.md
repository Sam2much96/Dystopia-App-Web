# Dystopia-App-Web

A custom web version of the Dystopia App game, written in HTML5 and JavaScript. This project is an 8-bit action RPG adapted for web browsers.

## Features

- **8-bit Action RPG**: Experience classic role-playing gameplay with retro graphics.
- **Web Compatibility**: Playable directly in modern web browsers without additional plugins.
- **Custom Engine**: Built using a custom game engine (LittleJS) tailored for web performance.

## Tools Used

1. LittleJS
2. Zzfx
3. Algokit (Typescript)
4. Tiled Editor
5. Krita
6. Aseprite

## Getting Started

To run the game locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Sam2much96/Dystopia-App-Web.git
   cd Dystopia-App-Web

   ```

2. **Run the Build Server**:
   Check the package,json for supported commands to run for testing / building

# Engine

The web build of Dystopia App Uses LittleJS game Engine for 2d rendering and game Logic, Threejs for 3d rendering, ZzFx for Sound Effects and Vercel + HowlerJs for Audio files playback

Game distributabels are built into the dist folder which is served as the /public folder
the game fetches all assets from the /public directory in the vercel server build
