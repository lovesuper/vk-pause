#/bin/sh
P=`jq -r '.short_name' manifest.json`
V=`jq -r '.version' manifest.json`
D=$P$V-publ
rm -r $D
mkdir -p $D

minify src/background.js
minify src/content.js
minify src/constants.js
minify src/options.js
htmlmin -o src/options.min.html src/options.html

find . -name '*.min.js' -o -name "*.png" | cpio -pdm $D
find . -name '*.min.html'| cpio -pdm $D

rm src/background.min.js
rm src/content.min.js
rm src/constants.min.js
rm src/options.min.js
rm src/options.min.html

jq -R 'gsub("[.]js"; ".min.js")' manifest.json --raw-output > $D/manifest.json.tmp1
jq -R 'gsub("[.]html"; ".min.html")' $D/manifest.json.tmp1 --raw-output > $D/manifest.json.tmp

rm $D/manifest.json.tmp1

json-minify $D/manifest.json.tmp > $D/manifest.json

rm $D/manifest.json.tmp

zip -r $D.zip $D

echo "done"

