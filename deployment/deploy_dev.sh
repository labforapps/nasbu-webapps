#!/bin/sh
set -e



ng build --project=core-models && ng build --project=core-services && ng build --project=practice-app --configuration=qa

cd dist/practice-app

aws s3 sync . s3://dev.nasbulegal.com  --profile nasbu --delete

aws cloudfront create-invalidation \
    --distribution-id E3MHELUD8EBU5U \
    --paths "/*" "/index.html" "/assets/i18n/*" --profile nasbu



