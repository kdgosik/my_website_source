#!/bin/sh

set -ev

VERSION=`cat VERSION.txt`

docker build -t kdgosik/gatsby:$VERSION .
docker build -t kdgosik/gatsby:latest .

