#!/bin/bash -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo -n '0.0.0' > .version
else
  scripts/semantic-release -travis-com -noci -dry -vf -slug VinnieApps/photos-frontend
fi

VERSION=$(cat .version)

echo "Building version $VERSION"

if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/0.0.0/$VERSION/" ./package.json
else
  sed -i -e "s/0.0.0/$VERSION/" ./package.json
fi

npm install
npm run bundle

DOCKER_IMAGE=photos-frontend:$VERSION

echo "Building Docker image: $DOCKER_IMAGE"
docker build -t "$DOCKER_IMAGE" .
