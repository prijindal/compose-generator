#!/bin/sh

cd dist_files/redis
docker compose down -v --remove-orphans
cd ../../

rm -r dist_files