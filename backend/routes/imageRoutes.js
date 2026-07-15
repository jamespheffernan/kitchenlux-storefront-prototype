const express = require('express');

const router = express.Router();

const PALETTES = [
  ['#153f35', '#dce9df'],
  ['#714b31', '#f1e2cf'],
  ['#33475b', '#dce6ef'],
  ['#634b66', '#eadfec'],
];

function normalizeLabel(value) {
  return String(value || 'kitchenware')
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .slice(0, 40) || 'kitchenware';
}

function placeholderSvg(value) {
  const label = normalizeLabel(value);
  const palette = PALETTES[label.length % PALETTES.length];
  const title = label.replace(/\b\w/g, (character) => character.toUpperCase());
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">Generated placeholder for the KitchenLux prototype</desc>
  <rect width="800" height="600" fill="${palette[1]}"/>
  <circle cx="400" cy="250" r="110" fill="${palette[0]}" opacity="0.12"/>
  <path d="M330 250h140M350 210v110M450 210v110" stroke="${palette[0]}" stroke-width="18" stroke-linecap="round"/>
  <text x="400" y="430" text-anchor="middle" font-family="system-ui, sans-serif" font-size="38" font-weight="700" fill="${palette[0]}">${title}</text>
  <text x="400" y="475" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" fill="${palette[0]}">Storefront prototype</text>
</svg>`;
}

function sendPlaceholder(req, res) {
  res.type('image/svg+xml');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(placeholderSvg(req.params.name || req.params.photoId));
}

router.get('/direct/:name', sendPlaceholder);
router.get('/proxy/:photoId/:size', sendPlaceholder);

module.exports = router;
module.exports.normalizeLabel = normalizeLabel;
module.exports.placeholderSvg = placeholderSvg;
