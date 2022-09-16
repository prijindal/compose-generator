#!/bin/sh

cd dist_files/example
docker compose down -v --remove-orphans
cd ../../

rm -r dist_files