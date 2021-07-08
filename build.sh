#!/usr/bin/env bash

echo $UUID


DOCKER_BUILDKIT=1 docker build \
     --build-arg BUILDKIT_INLINE_CACHE=1 \
     --cache-from ${IMAGE_NAME} \
     -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${IMAGE_NAME}:$UUID \
     -f Dockerfile \
     .

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com