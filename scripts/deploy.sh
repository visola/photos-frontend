#!/bin/bash

set -e

deploy_to_kubernetes() {
  project_name=$1
  publish_docker_image=gcr.io/$GCP_PROJECT_ID/$project_name/$GIT_SHA

  sed "s%DOCKER_IMAGE%$publish_docker_image%" src/main/kubernetes/deployment.yml | \
    sed "s%GIT_SHA%$GIT_SHA%" | \
    kubectl apply -f -
}

publish_docker_image() {
  project_name=$1
  docker_image=$project_name:latest
  publish_docker_image=gcr.io/$GCP_PROJECT_ID/$project_name/$GIT_SHA

  echo "Building and publishing image for $project_name: $publish_docker_image"
  docker build --build-arg CACHEBUST=$(date +%s) -t $docker_image .
  docker tag $docker_image $publish_docker_image
  docker push $publish_docker_image
}

main() {
  GIT_SHA=$(git rev-parse --short HEAD)
  VERSION=$(cat package.json | jq -r '.version')
  GCP_PROJECT_ID=$1

  echo "Git SHA: '$GIT_SHA'"
  echo "Version: '$VERSION'"
  echo "GCP Project: '$GCP_PROJECT_ID'"

  echo "Building..."
  npm run bundle

  publish_docker_image photos-frontend
  deploy_to_kubernetes photos-frontend
}

usage() {
    echo "Usage:"
    echo "   ./deploy_functions.sh {GCP_PROJECT_ID}"
    echo
    echo "  GCP_PROJECT_ID      Google Cloud Project to deploy the function to."
}

if [ -z "$1" ]; then
    usage
    exit 1
fi

main $1

