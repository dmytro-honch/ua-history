/**
 * Minifyes JSON - deletes whitespaces and new lines
 *
 * Usage:
 *   node minify-json.js input.json output.json
 */

import fs from 'fs';

const [, , inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
  console.log(`
  Usage: node minify-json.js <input.json> <output.json>
`);
  process.exit(1);
}

const inputData = fs.readFileSync(inputFile, 'utf8');
const json = JSON.parse(inputData);
const outputData = JSON.stringify(json);

fs.writeFileSync(outputFile, outputData);

const inputSize = Buffer.byteLength(inputData, 'utf8');
const outputSize = Buffer.byteLength(outputData, 'utf8');
const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

console.log(`✓ Minifyed`);
console.log(`  In:  ${(inputSize / 1024).toFixed(1)} KB`);
console.log(`  Out: ${(outputSize / 1024).toFixed(1)} KB`);
console.log(`  Reduction: ${reduction}%`);
