$(window).bind("load", onDeviceReady);
document.addEventListener("deviceready", onDeviceReady, false);

$('#map').live('pageshow',function(event, ui){
    getGeolocation();
});

var isConnected = false;
function onDeviceReady() {
	isConnected = true;
	document.addEventListener("backbutton", function (e) {
        if($.mobile.activePage.is('#login_page')){
			e.preventDefault();
		}
		else {
			if (confirm("Are you sure you want to exit?")) {
				navigator.app.exitApp();
			}
			else {
				return false;
			}
		}
        }, 
		false );
		onMapLoad();
}


function onMapLoad() {
	if (isConnected) {
		// load the google api
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src","http://maps.googleapis.com/maps/api/js?v=3&language=en&sensor=false&key=AIzaSyC3Lfqf-IDLFPgwO4kIU2o2VVar--TZI7c&callback=getGeolocation");
		document.getElementsByTagName("head")[0].appendChild(fileref);
		$.mobile.changePage("#map", { transition: "fade", changeHash: true });
	} else {
		alert("Must be connected to the Internet");
	}
}
function getGeolocation() {
	// get the user's gps coordinates and display map
	var options = {
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
		};
	navigator.geolocation.getCurrentPosition(loadMap,geoError, options);
}

function loadMap(position) {
	$('#map_canvas').height($(window).height() - $('#footer').height()-20);
	var latlng = new google.maps.LatLng(
	position.coords.latitude, position.coords.longitude);
	var myOptions = {
		zoom: 17,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	var mapObj = document.getElementById("map_canvas");
	var map = new google.maps.Map(mapObj, myOptions);
	var marker = new google.maps.Marker({position: latlng,map: map,title:"You are here, may be."});
	
}

function geoError(error) {
	alert('code: ' + error.code + '\nmessage: ' + error.message + '\n');
}

function exitApp(){
	if (confirm("Are you sure you want to exit?"))
	navigator.app.exitApp();
}