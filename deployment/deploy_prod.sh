#!/bin/sh
set -e


ng build --project=core-models && ng build --project=core-services && ng build --project=practice-app --prod

cd dist/practice-app

aws s3 sync . s3://app.nasbulegal.com  --profile nasbu --delete

aws cloudfront create-invalidation \
    --distribution-id EEOGDQA1MDQD5 \
    --paths "/*" "/index.html" "/assets/i18n/*" --profile nasbu

aws s3api list-objects --bucket app.nasbulegal.com \
 --query "Contents[].Key" --output text --profile nasbu \ | \
  tr '\t' '\n' | while read key; do aws s3api put-object-acl \
  --bucket app.nasbulegal.com --key "$key" --acl public-read --profile nasbu; done;




