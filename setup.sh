#!/usr/bin/env bash

rm -rf ./node_modules
rm -rf ./package-lock.json
npm cache verify
npm install