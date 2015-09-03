#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# clear and re-create the out directory
rm -rf gh-pages || exit 0;

grunt build

git clone --branch=gh-pages git://github.com/juampi92/Hyperlapse.js.git gh-pages

cp -r build/ gh-pages/
cp -r docs/ gh-pages/

# go to the out directory and create a *new* Git repo
cd gh-pages

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "juampi92@gmail.com"

git add .
git commit -m "Deploy to GitHub Pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" > /dev/null 2>&1