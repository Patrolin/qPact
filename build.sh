#!/usr/bin/env sh
rm -rf build
mkdir -p build

cat src/q.js > build/q.js

cat src/{q.js,Pact_blackmagic.js,blackmagic.js} > build/qPact_blackmagic.js

cat src/{q.js,Pact_blackhole.js} > build/qPact_blackhole.js
cat src/blackhole.css > build/blackhole.css
