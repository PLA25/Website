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

	var datalayer = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			url: kml,
			format: new ol.format.KML({
				extractStyles: false
			})
		}),
		blur: 60,
		radius: 100,
		visible: true
	});

	var toner = new ol.layer.Tile({
		source: new ol.source.Stamen({
			layer: 'toner'
		}),
		visible: true
	});

	var vector = datalayer.getSource();

	var view = map.getView();

	var isHMEnabled = false;

	view.on('propertychange', (event) => {
		if (event.key === "resolution") {
			onzoom();
		}
	});

	function onzoom(event) {
		var val = view.getZoom();
		datalayer.setRadius(parseInt(val * 3, 10));
		datalayer.setVisible(isHMEnabled);
		toner.setVisible(isHMEnabled);
	}

	map.addLayer(toner);
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