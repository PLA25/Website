/* global ol */

const center = ol.proj.transform([4.895168, 52.370216], 'EPSG:4326', 'EPSG:3857');

const view = new ol.View({
  center,
  zoom: 8, // 11,
  minZoom: 8,
  maxZoom: 15,
  extent: [
    375000, // Left
    6580000, // Bottom
    800000, // Right
    7075000, // Top
  ],
});

// eslint-disable-next-line no-unused-vars
const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: '/api/planet/{z}/{x}/{y}',
      }),
    }),
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: '/api/mapbox/{z}/{x}/{y}',
      }),
    }),
    new ol.layer.Vector({
      source: new ol.source.Vector({
        url: '/api/meetpunten',
        format: new ol.format.KML(),
      }),
    }),
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: '/api/heatmap/{z}/{x}/{y}',
      }),
    }),
  ],
  target: 'map',
  view,
});
