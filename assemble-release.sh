#!/bin/sh
P=`jq -r '.short_name' manifest.json`
V=`jq -r '.version' manifest.json`
D=$P$V-publ
rm -r $D
mkdir -p $D

minify src/background.js
minify src/content.js
minify lib/constants.js

find . -name '*.min.js' -o -name "*.png" | cpio -pdm $D

json-minify manifest.json > $D/manifest.json

rm src/background.min.js
rm src/content.min.js
rm lib/constants.min.js

jq -R 'gsub(".js"; ".min.js")' $D/manifest.json --raw-output >> $D/manifest.json

echo "done"
