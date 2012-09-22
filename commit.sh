#!/bin/bash
cat tiles.js | uglifyjs -o tiles.min.js
lessc -x tiles.less tiles.css
echo 'Commit message: '
read commit
git commit -am "$commit"
git push origin master
