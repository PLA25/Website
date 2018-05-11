/* global google, ol */
$(document).ready(() => {
  $('#goToError').hide();

  /* Layers */
  const googleLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    }),
  });
  googleLayer.setVisible(false);

  const heatmapXYZ = new ol.source.XYZ({
    url: '/api/heatmap/{z}/{x}/{y}',
  });

  const heatmapLayer = new ol.layer.Tile({
    source: heatmapXYZ,
  });

  const mapboxLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: '/api/mapbox/{z}/{x}/{y}',
    }),
  });

  const planetXYZ = new ol.source.XYZ({
    url: '/api/planet/{z}/{x}/{y}',
  });

  const planetLayer = new ol.layer.Tile({
    source: planetXYZ,
  });

  const sensorhubLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '/api/sensorhubs',
      format: new ol.format.KML(),
    }),
  });

  planetXYZ.setUrl(`/api/${new Date().getTime()}/planet/{z}/{x}/{y}`);

  heatmapXYZ.setUrl(`/api/${new Date().getTime()}/heatmap/{z}/{x}/{y}`);

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
    const input = document.getElementById('address');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.setComponentRestrictions({
      country: ['nl'],
    });
  }

  google.maps.event.addDomListener(window, 'load', addressAutocomplete);

  const geocoder = new google.maps.Geocoder();

  $('#address').on('change blur', () => {
    const address = document.getElementById('address').value;

    geocoder.geocode({
      address,
      componentRestrictions: {
        country: 'NL',
      },
    }, (results, status) => {
      switch (status) {
        case 'OK':
        {
          $('#goToError').hide();

          const geocodeLat = results[0].geometry.location.lat();
          const geocodeLng = results[0].geometry.location.lng();
          const convertedLocation = ol.proj.fromLonLat([geocodeLng, geocodeLat]);

          view.animate({
            center: convertedLocation,
            duration: 500,
          });

          break;
        }

        case 'ZERO_RESULTS':
        {
          $('#goToError').text('There is no result matching your query.');
          $('#goToError').show();

          break;
        }

        case 'OVER_QUERY_LIMIT':
        {
          $('#goToError').text('You are trying to search too much.');
          $('#goToError').show();

          break;
        }

        default:
        {
          $('#goToError').text(`Geocode was not successful for the following reason: ${status}`);
          $('#goToError').show();
        }
      }
    });
  });

  let measurements = 7 * 24;
  let steps = 2;

  const handle = $('#custom-handle');
  $('#slider').slider({
    min: 0,
    max: measurements,
    value: measurements,
    step: steps,
    slide(event, ui) {
      let {
        value,
      } = ui;

      const dateNow = new Date().getTime() / 1000 / 60 / 60;
      const offset = ((measurements) - value);
      const currentdate = new Date(Math.floor((dateNow - offset)) * 1000 * 60 * 60);
      value = `${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()} @ ${currentdate.getHours()}`;

      planetXYZ.setUrl(`/api/${currentdate.getTime()}/planet/{z}/{x}/{y}`);

      handle.text(value);
    },
  });

  $('.dropdown-item').click((e) => {
    const $this = $(e.currentTarget);

    $('a', $('#time-menu')).each((i, el) => {
      $(el).show();
    });

    $this.hide();
    $('#time-button').text($this.text());

    const newSteps = parseInt($this.attr('id').split('-')[1], 10);
    steps = newSteps;
    $('#slider').slider('option', 'step', newSteps);

    const newMax = 7 * 24 * newSteps;
    measurements = newMax;
    $('#slider').slider('option', 'max', newMax);
  });
});
