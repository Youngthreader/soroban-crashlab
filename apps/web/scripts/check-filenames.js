/* eslint-disable @typescript-eslint/no-require-imports -- plain Node script, no ESM interop */
const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

const srcDir = path.join(__dirname, "../src");
const files = walk(srcDir);
const badPrefixes = ["add-", "implement-", "integrate-", "create-"];

const badFiles = files.filter(f => {
  const basename = path.basename(f).toLowerCase();
  return badPrefixes.some(prefix => basename.startsWith(prefix));
});

if (badFiles.length > 0) {
  console.error("Lint error: The following files use banned prefixes (add-/implement-/integrate-/create-):");
  badFiles.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log("Filename lint passed.");
}