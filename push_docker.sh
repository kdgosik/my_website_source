#!/bin/sh

set -ev

VERSION=`cat VERSION.txt`

docker push kdgosik/gatsby:${VERSION}
docker push kdgosik/gatsby:latest
