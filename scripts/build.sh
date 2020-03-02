#!/bin/bash -e

VERSION=$(cat .version)

if [ ! -z "$GITHUB_TOKEN" ]; then
  scripts/semantic-release -travis-com -noci -dry -vf -slug VinnieApps/photos-frontend
  sed -i -e "s/0.0.0/$VERSION/" package.json
fi

npm install
npm run bundle

DOCKER_IMAGE=photos-frontend:$VERSION

echo "Building Docker image: $DOCKER_IMAGE"
docker build -t "$DOCKER_IMAGE" .
