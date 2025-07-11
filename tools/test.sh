#!/bin/bash
#
# Using HTML-proofer to test site.
#
# Requirement: https://github.com/gjtorikian/html-proofer
#
# Usage: bash /path/to/test.sh
#
# v2.0
# https://github.com/cotes2020/jekyll-theme-chirpy
# © 2020 Cotes Chung
# MIT Licensed

DEST=_site
URL_IGNORE=cdn.jsdelivr.net

set -x
bundle exec htmlproofer $DEST \
  --disable-external=true \
  --enforce-https=false \
  --ignore-empty-alt=true \
  --ignore-missing-alt=true \
  --allow-hash-href=true \
  --allow-missing-href=true \
  --ignore-urls $URL_IGNORE
