  var center = ol.proj.transform([4.895168, 52.370216], 'EPSG:4326', 'EPSG:3857');
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: '/api/planet/{z}/{x}/{y}'
        })
      }),
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: '/api/mapbox/{z}/{x}/{y}'
        })
      }),
      new ol.layer.Vector({
        source: new ol.source.Vector({
          url: '/api/meetpunten',
          format: new ol.format.KML()
        })
      })
    ],
    target: 'map',
    view: new ol.View({
		center: center,
		zoom: 11,
		minZoom: 11,
		maxZoom: 14,        
    })
  });