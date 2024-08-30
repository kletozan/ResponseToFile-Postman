#~/bin/sh

set -ex

#
# https://gist.github.com/garrettsickles/69d73ffce920ee7d8f6023cf5706f012
#

# npm install protobufjs protobufjs-cli json-minify

brew install node
npm install protobufjs protobufjs-cli
npm install -g json-minify

outdir=~/Postman/files
mkdir -p $outdir

cd $ZWIFT_SRC_HOME/zwift-protocol
git pull
cd -

node node_modules/.bin/pbjs -t json $ZWIFT_SRC_HOME/zwift-protocol/*.proto --out $outdir/zwift-protocol.json

json-minify $outdir/zwift-protocol.json > $outdir/zwift-protocol.min.json

echo "$outdir/zwift-protocol.min.json"

#wget https://github.com/protobufjs/protobuf.js/blob/master/dist/protobuf.min.js
