#!/bin/sh
set -e


ng build --project=core-models && ng build --project=core-services && ng build --project=practice-app --prod

# --- Sentry: subir source maps (solo si hay credenciales) ---
# Requiere en el entorno: SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT.
# Usa debug IDs (inject + upload), por lo que no requiere emparejar "release".
if [ -n "$SENTRY_AUTH_TOKEN" ]; then
  npx @sentry/cli@3 sourcemaps inject dist/practice-app
  npx @sentry/cli@3 sourcemaps upload \
    --org "$SENTRY_ORG" --project "$SENTRY_PROJECT" dist/practice-app
fi

# No publicar los .map en S3 (hidden source maps: ya se subieron a Sentry)
find dist/practice-app -name '*.map' -delete

cd dist/practice-app

aws s3 sync . s3://app.nasbulegal.com --acl public-read  --profile nasbu --delete

aws cloudfront create-invalidation \
    --distribution-id EEOGDQA1MDQD5 \
    --paths "/*" "/index.html" "/assets/i18n/*" --profile nasbu

# aws s3 ls app.nasbulegal.com \
#  --query "Contents[].Key" --output text --profile nasbu \ | tr '\t' '\n' | while read key; do aws s3api put-object-acl \
#   --bucket app.nasbulegal.com --key "$key" --acl public-read --profile nasbu; done;




