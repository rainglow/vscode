#!/bin/bash

# Run docker image to build the themes.
docker run -e PATTERN=vscode -v $PWD/output/:/src/output daylerees/rainglow:latest

# Kill old themes.
rm -rf ../themes/*.json

# Move themes to the root.
cp -R output/vscode/* ../themes/

# Delete temp themes.
rm -rf output