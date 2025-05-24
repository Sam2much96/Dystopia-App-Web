# Vite build script
#
# Fetures:
# (1) triggers vite build 
# (2) enters the distribution folder and copies the nedded project files to dist
# (3) controls the build process on vercel

#!/bin/bash

# Build the project with Vite
vite build & \


# Debug the Home Directory
echo "dir debug: " & \

ls -al & \


# Change to the dist directory and debug all files in there
cd dist/ & \


echo "dist debug: " & \
# List all files
ls -al & \





