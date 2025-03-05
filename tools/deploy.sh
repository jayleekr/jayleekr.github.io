#!/bin/bash
#
# Deploy the content of _site to 'origin/<pages_branch>'
#
# v2.5
# https://github.com/cotes2020/jekyll-theme-chirpy
# © 2020 Cotes Chung
# Published under MIT License


set -eu

PAGES_BRANCH="gh-pages"

_no_branch=false

if [[ -z `git branch -av | grep $PAGES_BRANCH` ]]; then
  _no_branch=true
  git checkout -b $PAGES_BRANCH
else
  git checkout $PAGES_BRANCH
fi

# 로컬 빌드와 일치하도록 baseurl을 빈 문자열로 설정하여 빌드
if [[ ! -d _site ]]; then
  JEKYLL_ENV=production bundle exec jekyll build -b "" -d _site
fi

mv _site ../
mv .git ../

rm -rf * && rm -rf .[^.] .??*

mv ../_site/* .
mv ../.git .

git config --global user.name "GitHub Actions"
git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"

git update-ref -d HEAD
git add -A
git commit -m "[Automation] Site update No.${GITHUB_RUN_NUMBER}"

if [[ $_no_branch = true ]]; then
  git push -u origin $PAGES_BRANCH
else
  git push -f
fi
