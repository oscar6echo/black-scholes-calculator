#!/bin/bash

# shellcheck disable=SC2094

git push origin --delete gh-pages
git branch -D gh-pages

git checkout --orphan gh-pages

git rm --cached -rf .

{
    echo .gitignore
    echo deploy-ghp.sh
    echo README.md
    echo create_html.py
} >.gitignore

cp index.html 404.html

git add .
git commit -m "Deploy"
git push --set-upstream origin gh-pages

git checkout main
