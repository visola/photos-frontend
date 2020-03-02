#!/bin/bash -e

publish_docker_image() {
  project_name=$1
  docker_image=$project_name:$VERSION
  publish_docker_image=gcr.io/$GCP_PROJECT_ID/$project_name:$VERSION

  echo "Publishing image for $project_name: $publish_docker_image"
  docker tag $docker_image $publish_docker_image
  docker push $publish_docker_image
}

trigger_deploy_in_dev() {
  curl -X POST -i \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -d '{"event_type":"photos_frontend_build_success"}' \
    https://api.github.com/repos/VinnieApps/vinnieapps-infrastructure/dispatches
}

main() {
  GIT_SHA=$(git rev-parse --short HEAD)
  VERSION=$(cat .version)
  GCP_PROJECT_ID=$1

  echo "Git SHA: '$GIT_SHA'"
  echo "Version: '$VERSION'"
  echo "GCP Project: '$GCP_PROJECT_ID'"

  # Login to Docker
  openssl aes-256-cbc -K $encrypted_bc40a34dabb2_key -iv $encrypted_bc40a34dabb2_iv -in google-key.json.enc -out google-key.json -d
  cat google-key.json | docker login -u _json_key --password-stdin https://gcr.io

  publish_docker_image 'photos-frontend'

  scripts/semantic-release -travis-com -slug VinnieApps/photos

  trigger_deploy_in_dev
}

usage() {
    echo "Usage:"
    echo "   ./release.sh {GCP_PROJECT_ID}"
    echo
    echo "  GCP_PROJECT_ID      Google Cloud Project to release to."
}

if [ -z "$1" ]; then
    usage
    exit 1
fi

if [ "$TRAVIS_BRANCH" == "master" ]; then
  main $1
else
  echo "Not in master branch, exiting..."
  exit 0
fi
