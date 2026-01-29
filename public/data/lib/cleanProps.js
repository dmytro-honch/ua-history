/**
 * Delete redundand properties in PROPERTIES (leave only "type" and "name")
 *
 * usage:
 *   node clean-properties.js input.geojson output.geojson
 */

import fs from 'fs';

const [, , inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
  console.log(`
  usage: node clean-properties.js <input.geojson> <output.geojson>
`);
  process.exit(1);
}

const KEEP_FIELDS = ['type', 'name'];

function cleanProperties(props) {
  if (!props) return null;

  const cleaned = {};
  for (const field of KEEP_FIELDS) {
    if (props[field] !== undefined) {
      cleaned[field] = props[field];
    }
  }

  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

function cleanFeature(feature) {
  return {
    type: feature.type,
    properties: cleanProperties(feature.properties),
    geometry: feature.geometry,
  };
}

function cleanGeoJSON(geojson) {
  if (geojson.type === 'FeatureCollection') {
    return {
      type: 'FeatureCollection',
      features: geojson.features.map(cleanFeature),
    };
  }

  if (geojson.type === 'Feature') {
    return cleanFeature(geojson);
  }

  return geojson;
}

const inputData = fs.readFileSync(inputFile, 'utf8');
const geojson = JSON.parse(inputData);

const cleaned = cleanGeoJSON(geojson);
const outputData = JSON.stringify(cleaned);

fs.writeFileSync(outputFile, outputData);

const inputSize = Buffer.byteLength(inputData, 'utf8');
const outputSize = Buffer.byteLength(outputData, 'utf8');
const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

console.log(`✓ Deleted properties (left: ${KEEP_FIELDS.join(', ')})`);
console.log(`  In:  ${(inputSize / 1024).toFixed(1)} KB`);
console.log(`  Out: ${(outputSize / 1024).toFixed(1)} KB`);
console.log(`  Reduction: ${reduction}%`);
