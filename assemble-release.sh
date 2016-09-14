#/bin/sh
P=`jq -r '.short_name' manifest.json`
V=`jq -r '.version' manifest.json`
D=$P$V-publ
rm -r $D
mkdir -p $D

minify src/background.js > src/background.min.js
minify src/content.js > src/content.min.js
minify src/constants.js > src/constants.min.js

find . -name '*.min.js' -o -name "*.png" | cpio -pdm $D

rm src/background.min.js
rm src/content.min.js
rm src/constants.min.js

jq -R 'gsub("[.]js"; ".min.js")' manifest.json --raw-output > $D/manifest.json.tmp
json-minify $D/manifest.json.tmp > $D/manifest.json

rm $D/manifest.json.tmp

zip -r $D.zip $D

echo "done"

