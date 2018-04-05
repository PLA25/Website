/**
 *
 * Gebruik deze functie om de heatmap laag aan de kaart toe te voegen
 *
 * @param map Het ol.Map object waaraan de laag toegevoegd moet worden
 *
 * @return Een object met de functie "enable" om de heatmap aan of uit te zetten en "isEnabled" om te kijken of het wel aan staat.
 *
 */
function addHeatmap(map) {

	var layer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: '/white.png'
		})
	});

	var tempLayer = new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: '/api/heatmap/{x}/{y}/{z}'
		})
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
		layer.setVisible(isHMEnabled);
		tempLayer.setVisible(isHMEnabled);
	}

	map.addLayer(layer);
	map.addLayer(tempLayer);

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
		"disable": () => {
			this.enable(false);
		},
		"isEnabled": () => {
			return isHMEnabled;
		}
	});

}