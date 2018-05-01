/* global google, ol */
$(document).ready(() => {
  /* Layers */
  const googleLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    }),
  });
  googleLayer.setVisible(false);

  const heatmapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: '/api/heatmap/{z}/{x}/{y}',
    }),
  });

  const mapboxLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: '/api/mapbox/{z}/{x}/{y}',
    }),
  });

  const planetLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: '/api/planet/{z}/{x}/{y}',
    }),
  });

  const sensorhubLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '/api/sensorhubs',
      format: new ol.format.KML(),
    }),
  });

  const center = ol.proj.transform([4.895168, 52.370216], 'EPSG:4326', 'EPSG:3857');
  const view = new ol.View({
    center,
    zoom: 8,
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
      googleLayer,
      planetLayer,
      mapboxLayer,
      sensorhubLayer,
      heatmapLayer,
    ],
    target: 'map',
    view,
  });

  /* Initial state of the checkboxes */
  $('#mapboxLayer').prop('checked', true);
  $('#heatmapLayer').prop('checked', true);
  $('#sensorhubLayer').prop('checked', true);

  /* Events */
  $('#heatmapLayer').change(() => {
    const isChecked = $('#heatmapLayer').prop('checked');
    heatmapLayer.setVisible(isChecked);
  });

  $('#mapboxLayer').change(() => {
    const isChecked = $('#mapboxLayer').prop('checked');
    mapboxLayer.setVisible(isChecked);
  });

  $('#sensorhubLayer').change(() => {
    const isChecked = $('#sensorhubLayer').prop('checked');
    sensorhubLayer.setVisible(isChecked);
  });

  $('#typeSat').change(() => {
    const isChecked = $('#typeSat').prop('checked');
    googleLayer.setVisible(!isChecked);
    planetLayer.setVisible(isChecked);

    $('#mapboxLayer').prop('checked', true);
    $('#mapboxLayer').prop('disabled', false);
    mapboxLayer.setVisible(true);
  });

  $('#typeMap').change(() => {
    const isChecked = $('#typeMap').prop('checked');
    googleLayer.setVisible(isChecked);
    planetLayer.setVisible(!isChecked);

    $('#mapboxLayer').prop('checked', false);
    $('#mapboxLayer').prop('disabled', true);
    mapboxLayer.setVisible(false);
  });

  function addressAutocomplete() {
    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.setComponentRestrictions({'country': ['nl']});
  }

  google.maps.event.addDomListener(window, 'load', addressAutocomplete);

  const geocoder = new google.maps.Geocoder();

  $('#goTo').click(() => {
    const address = document.getElementById('address').value;

    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const geocodeLat = results[0].geometry.location.lat();
        const geocodeLng = results[0].geometry.location.lng();
        const convertedLocation = ol.proj.fromLonLat([geocodeLng, geocodeLat]);

        view.animate({
          center: convertedLocation,
          duration: 500,
        });
      } else {
        alert(`Geocode was not successful for the following reason: ${status}`);
      }
    });
  });
});
