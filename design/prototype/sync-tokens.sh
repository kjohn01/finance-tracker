#!/bin/sh
# Re-inlines design/tokens.css into the prototype so the two never drift.
# Usage: sh design/prototype/sync-tokens.sh   (run from the repository root)
set -e
node -e '
const fs=require("fs"),p="design/prototype/index.html";
const html=fs.readFileSync(p,"utf8"),tok=fs.readFileSync("design/tokens.css","utf8");
const a="/* TOKENS:START */",b="/* TOKENS:END */",i=html.indexOf(a),j=html.indexOf(b);
if(i<0||j<0)throw new Error("token markers not found");
fs.writeFileSync(p,html.slice(0,i+a.length)+"\n"+tok+html.slice(j));
console.log("tokens synced");'
