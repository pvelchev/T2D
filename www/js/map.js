//$(window).bind("load", onMapLoad);
document.addEventListener("deviceready", onMapLoad, false);

var isConnected = true;
function onMapLoad() {
	if($.mobile.activePage.is('#login_page')){
        e.preventDefault();
    }
    else {
        if (confirm("Are you sure you want to logout?")) {
            /* Here is where my AJAX code for logging off goes */
        }
        else {
            return false;
        }
    }, 
	false );
	
	if (isConnected) {
		// load the google api
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src","http://maps.googleapis.com/maps/api/js?v=3&language=en&sensor=false&key=AIzaSyC3Lfqf-IDLFPgwO4kIU2o2VVar--TZI7c&callback=getGeolocation");
		document.getElementsByTagName("head")[0].appendChild(fileref);
		$('#map_canvas').height($(window).height() - $('#footer').height()-20);
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
	$.mobile.changePage("#map", { transition: "fade", changeHash: true });
	var latlng = new google.maps.LatLng(
	position.coords.latitude, position.coords.longitude);
	var myOptions = {
		zoom: 17,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	var mapObj = document.getElementById("map_canvas");
	var map = new google.maps.Map(mapObj, myOptions);
	var marker = new google.maps.Marker({position: latlng,map: map,title:"You"});
	
}

function geoError(error) {
	alert('code: ' + error.code + '\nmessage: ' + error.message + '\n');
}

function exitApp(){
	if (confirm("Are you sure to exit?"))
	navigator.app.exitApp();
}