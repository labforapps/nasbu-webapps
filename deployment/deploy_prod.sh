#!/bin/sh
set -e



ng build --project=core-models && ng build --project=core-services && ng build --project=practice-app --prod

cd dist/practice-app

aws s3 sync . s3://app.nasbulegal.com  --profile nasbu --delete

aws cloudfront create-invalidation \
    --distribution-id EEOGDQA1MDQD5 \
    --paths "/*" "/index.html" "/assets/i18n/*" --profile nasbu



