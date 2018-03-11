addEventListener('load', function() {
	var params = window.location.href.split("?")[1].split("&"),
	text = "Welkom " + params[0].split("=")[1] + " (" + params[1].split("=")[1] + ")";
	document.getElementById("gebruiker").innerText = text;
	//
	var canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d"),
	coords = document.getElementById('coords'),
	image = getImage("kaart.gif"),
	doDrag = false,
	doRefresh = false,
	zFactor = 0,
	imgWidth = image.width,
	imgHeight = image.height,
	mx = 0,
	my = 0;
	//
	var fw = 1, fh = 1;
	if (imgWidth < screen.width) {
		fw = screen.width / imgWidth;
	}
	if (imgHeight < screen.height) {
		fh = screen.height / imgHeight;
	}
	if (fw > fh) {
		imgWidth *= fw;
		imgHeight *= fw;
	} else {
		imgWidth *= fh;
		imgHeight *= fh;
	}
	//
	var x = -((imgWidth / 2) - (window.innerWidth / 2)),
	y = -((imgHeight / 2) - (window.innerHeight / 2));
	//
	ctx.fillStyle = "#000000";
	ctx.drawImage(image, x, y, imgWidth, imgHeight);
	//
	var ref = true,
	r = setInterval(function() {
		var maxX = -(imgWidth - window.innerWidth),
		maxY = -(imgHeight- window.innerHeight);
		if (x < maxX) {
			x = maxX;
		}
		if (x > 0) {
			x = 0;
		}
		if (y > 0) {
			y = 0;
		}
		if (y < maxY) {
			y = maxY;
		}
		coords.innerText = ("Latitude: " + my + ", Longitude: " + mx);
		if (doRefresh || ref) {
			canvas.setAttribute('width', window.innerWidth);
			canvas.setAttribute('height', window.innerHeight);
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
			ctx.drawImage(image, x, y, imgWidth, imgHeight);
		}
		if (ref) {
			ref = false;
		}
	}, 20);
	//
	window.addEventListener('resize', function() {
		ref = true;
	});
	//
	canvas.addEventListener('wheel', function(e) {
		//WIP
		//ref = true;
	});
	//
	canvas.addEventListener('mousedown', dragStart);
	//
	canvas.addEventListener('mouseup', dragEnd);
	//
	canvas.addEventListener('mouseleave', dragEnd);
	//
	var cx, cy;
	canvas.addEventListener('mousemove', function(e) {
		if (doDrag) {
			dx = e.clientX - cx;
			dy = e.clientY - cy;
			//
			x += dx;
			y += dy;
			//
			cx = e.clientX;
			cy = e.clientY;
		}
		mx = e.clientX - x;
		my = e.clientY - y;
	});
	//
	function dragStart(x) {
		doRefresh = true;
		cx = x.clientX;
		cy = x.clientY;
		doDrag = true;
		document.body.style.cursor = "move";
	}
	//
	function dragEnd() {
		doRefresh = false;
		doDrag = false;
		document.body.style.cursor = "initial"
	}
});

function getImage(url) {
	var i = new Image();
	i.src = url;
	return i;
}