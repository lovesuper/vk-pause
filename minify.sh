#!/bin/sh
minify src/background.js
minify src/content.js
minify lib/constants.js
json-minify manifest.json > manifest.min.json


