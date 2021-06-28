#!/usr/bin/env bash

echo $CODEBUILD_RESOLVED_SOURCE_VERSION


DOCKER_BUILDKIT=1 docker build \
     --build-arg BUILDKIT_INLINE_CACHE=1 \
     --cache-from ${IMAGE_NAME} \
     -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${IMAGE_NAME}:$CODEBUILD_RESOLVED_SOURCE_VERSION \
     -f Dockerfile \
     .

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com