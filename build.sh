# Vite build script
#
# Fetures:
# (1) triggers vite build 
# (2) enters the distribution folder and copies the nedded project files to dist
# (3) controls the build process on vercel

#!/bin/bash

# Build the project with Vite
vite build & \

# Change to the dist directory
cd dist & \


echo "dist debug: " &\
# List all files
ls -al & \


# copies out the build assets to the public directory and check
# Copy index.html and assets to ../public/
cp -R index.html ./assets ../public/ & \

# Change to the public directory
cd ../public & \

echo "public debug: " & \

# List all files in public
ls -al

