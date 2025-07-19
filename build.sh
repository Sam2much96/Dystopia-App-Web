# Vite build script
#
# Fetures:
# (1) triggers vite build 
# (2) enters the distribution folder and copies the nedded project files to dist
# (3) controls the build process on vercel
# Bugs:
# (1) doesn't copy enemy tileset to dist folder
# (2) doesnt copy audio files to dist folder


#!/bin/bash

set -euo pipefail

echo "🔧 Building the project with Vite..." &&

# Build the project with Vite
npx vite build --emptyOutDir && 


# Debug the Home Directory
echo "dir debug: " && 

ls -al &&


# copy audio files
#cp -r audio dist/ &&

# copy enemy tileset
cp enemy_tileset_128x128.png /dist &&



echo "📁 Changing to dist directory..."
# Change to the dist directory and debug all files in there
cd dist/ &&


echo "dist debug: " &&

# List all files
ls -al 

#run local debug
#npx vite




