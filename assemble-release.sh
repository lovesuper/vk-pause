#/bin/sh
P=`jq -r '.short_name' manifest.json`
V=`jq -r '.version' manifest.json`
D=$P$V-publ
rm -r $D
mkdir -p $D

minify src/background.js > src/background.min.js
minify src/content.js > src/content.min.js
minify lib/constants.js > lib/constants.min.js
minify lib/jquery-2.1.4.js > lib/jquery-2.1.4.min.js

find . -name '*.min.js' -o -name "*.png" | cpio -pdm $D

rm src/background.min.js
rm src/content.min.js
rm lib/constants.min.js
rm lib/jquery-2.1.4.min.js

jq -R 'gsub("[.]js"; ".min.js")' manifest.json --raw-output > $D/manifest.json.tmp
json-minify $D/manifest.json.tmp > $D/manifest.json

rm $D/manifest.json.tmp

zip -r $D.zip $D

echo "done"

