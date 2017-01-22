#!/usr/bin/env bash
# adapted from script published on:
# https://therocketeers.github.io/blog/using-travis-ci-to-deploy-jekyll-on-netlify/
set -e # halt script on error

zip -r wallaby.zip dist

curl -H "Content-Type: application/zip" \
  -H "Authorization: Bearer $NETLIFY_KEY" \
  --data-binary "@wallaby.zip" \
  https://api.netlify.com/api/v1/sites/$NETLIFY_APP/deploys
