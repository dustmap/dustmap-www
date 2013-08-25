#!/usr/bin/env bash

set -e
set -u

pushd public_dev/scripts

../../node_modules/.bin/r.js -o build.js

popd