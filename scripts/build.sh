#!/bin/bash -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo -n '0.0.0' > .version
else
  scripts/semantic-release -travis-com -noci -dry -vf -slug VinnieApps/photos-frontend
fi

VERSION=$(cat .version)

ls -la

echo "Building version $VERSION"
sed -i '.backup' "s/0.0.0/$VERSION/" ./package.json

npm install
npm run bundle

DOCKER_IMAGE=photos-frontend:$VERSION

echo "Building Docker image: $DOCKER_IMAGE"
docker build -t "$DOCKER_IMAGE" .
