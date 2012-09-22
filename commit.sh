#!/bin/bash
cat jquery.tiles.js | uglifyjs -o jquery.tiles.min.js
lessc -x jquery.tiles.less jquery.tiles.css
echo 'Commit message: '
read commit
git commit -am "$commit"
git push origin master
