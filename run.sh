#!/bin/sh

ts-node src/redis.ts

cd dist_files/redis
docker compose up -d --remove-orphans
cd ../../

HOST="192.168.193.218"

redis-cli --cluster create \
$HOST:7000 \
$HOST:7001 \
$HOST:7002 \
$HOST:7003 \
$HOST:7004 \
$HOST:7005 \
--cluster-replicas 1
