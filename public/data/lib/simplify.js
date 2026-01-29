/**
 * Simplifyes geoJSON-files (updates precision)
 *
 * usage:
 *   node simplify.js input.geojson output.geojson [precision]
 *
 * args:
 *   input.geojson  - input file
 *   output.geojson - output file
 *   precision      - amound digits after period (default: 5)
 *
 * example:
 *   node simplify.js ukraine.geojson ukraine-simplified.geojson 4
 */

import fs from 'fs';

const [, , inputFile, outputFile, precisionArg] = process.argv;

if (!inputFile || !outputFile) {
  console.log(`
  usage: node simplify.js <input.geojson> <output.geojson> [precision]

  precision:
    6 digits ≈ 0.1m
    5 digits ≈ 1m    (default)
    4 digits ≈ 11m
    3 digits ≈ 110m
`);
  process.exit(1);
}

const precision = parseInt(precisionArg) || 5;

function roundCoord(num) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

function simplifyCoordinates(coords) {
  if (typeof coords[0] === 'number') {
    // [lng, lat] or [lng, lat, altitude]
    return coords.slice(0, 2).map(roundCoord);
  }
  return coords.map(simplifyCoordinates);
}

function simplifyGeometry(geometry) {
  if (!geometry) return geometry;

  return {
    ...geometry,
    coordinates: simplifyCoordinates(geometry.coordinates),
  };
}

function simplifyFeature(feature) {
  return {
    ...feature,
    geometry: simplifyGeometry(feature.geometry),
  };
}

function simplifyGeoJSON(geojson) {
  if (geojson.type === 'FeatureCollection') {
    return {
      ...geojson,
      features: geojson.features.map(simplifyFeature),
    };
  }

  if (geojson.type === 'Feature') {
    return simplifyFeature(geojson);
  }

  return simplifyGeometry(geojson);
}

const inputData = fs.readFileSync(inputFile, 'utf8');
const geojson = JSON.parse(inputData);

const simplified = simplifyGeoJSON(geojson);

const outputData = JSON.stringify(simplified);
fs.writeFileSync(outputFile, outputData);

const inputSize = Buffer.byteLength(inputData, 'utf8');
const outputSize = Buffer.byteLength(outputData, 'utf8');
const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

console.log(`✓ Symplifyed for ${precision} digits`);
console.log(`  In:  ${(inputSize / 1024).toFixed(1)} KB`);
console.log(`  Out: ${(outputSize / 1024).toFixed(1)} KB`);
console.log(`  Reduction: ${reduction}%`);
