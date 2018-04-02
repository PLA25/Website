/**
 *
 * Gebruik deze functie om de heatmap laag aan de kaart toe te voegen
 *
 * @param map Het ol.Map object waaraan de laag toegevoegd moet worden
 * @param kml De locatie van het desbetreffende kml bestand.
 *
 * @return Een object met de functie "enable" om de heatmap aan of uit te zetten en "isEnabled" om te kijken of het wel aan staat.
 *
 */
function addHeatmap(map, kml) {

//https://gis.stackexchange.com/questions/130603/how-to-resize-a-feature-and-prevent-it-from-scaling-when-zooming-in-openlayers-3?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
//https://openlayers.org/en/latest/apidoc/ol.geom.Geometry.html
//http://dev.openlayers.org/examples/resize-features.html
//https://openlayers.org/en/latest/examples/kml-earthquakes.html
	var datalayer = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			url: kml,
			format: new ol.format.KML({
				extractStyles: false
			})
		}),
		blur: 60,
		radius: 40,
		visible: true
	});

	var vector = datalayer.getSource();
	
	vector.on('addfeature', e => {
		var f = e.feature;
		var parts = f.get('name').split(', ');
		f.set('name', parts[0]);
		if (parts[1]) {
			f.set('weight', parts[1]);
		} else {
			f.set('weight', 0.5);
		}
	});

	var view = map.getView();

	var isHMEnabled = false;

	view.on('propertychange', event => {
		if (event.key === "resolution") {
			onzoom();
		}
	});

	function onzoom(event) {
		var val = view.getZoom();
		datalayer.setVisible(isHMEnabled);
	}

	map.addLayer(datalayer);

	onzoom();
	
	window.addEventListener('load', onzoom);

	return ({
		"enable": value => {
			var type = typeof value;
			if (type === "boolean") {
				isHMEnabled = value;
				onzoom();
			} else if (type === "undefined") {
				isHMEnabled = true;
			}
		},
		"isEnabled": () => {
			return isHMEnabled;
		}
	});

}