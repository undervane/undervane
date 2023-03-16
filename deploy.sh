#!/usr/bin/env sh

# abort on errors
set -e

# build
echo Building. this may take a minute...
npm run generate

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'example.com' > CNAME

echo Deploying..
git init
git add -A
git commit -m '✨ Latest version deploy'

# deploy
git push -f https://github.com/undervane/undervane.git deploy

# undo git init
rm -rf .git

cd -