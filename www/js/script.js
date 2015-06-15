var _i_=0;
function startTime() {
	_i_++;
    document.getElementById('clock').innerHTML = _i_;
    var t = setTimeout(function(){startTime()},1000);
}


var isConnected = false;
var to_alert = true;
var new_location;
function check_conection(){ 
	isConnected = navigator.onLine ? true : false;
	if (!isConnected && to_alert) { to_alert=false;  alert("You are NOT connected to Internet");}
	if (isConnected && !to_alert) { to_alert=true;   alert("You are connected to Internet");}
}

var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
if ( app ) {
    // PhoneGap application
	document.addEventListener("deviceready", onDeviceReady, false);
} else {
    // Web page
	$(window).bind("load", onDeviceReady);
}

function try_to_getGeolocation(){
	if (window.new_location)  {window.new_location = false; onMapLoad();}
}


function onDeviceReady() { 
	startTime();
	document.addEventListener("backbutton", function (e) {
        alert('Please use Exit button to close application');
	},
	false );
	
	init_search(); // this sets new_location
	$('#map').bind('pageshow',function(event, ui){ try_to_getGeolocation();} );
	check_conection();
	window.new_location = false;
	onMapLoad();
}
var address, address_source,distance,price1,price2,language;

function init_search(){
	$('#address').change(function(){ localStorage.setItem("address",$(this).val());});
	address=localStorage.getItem("address");
	$('#address').val(address);
	
	language = localStorage.getItem('language');
	if (typeof language == 'undefined' ) {language = 'en'; localStorage.setItem('language','en'); }
	$('#language').val(language);

	address_source = localStorage.getItem("address_source");
	if (typeof address_source == 'undefined' ) {address_source = 'useGPS'; localStorage.setItem('address_source','useGPS'); }
	$('#'+address_source).click();
	
	$('#search').page();
	$('#distance').change(function(){ localStorage.setItem("distance",$(this).val());});
	distance = localStorage.getItem("distance");
	if (typeof distance == 'undefined' ) {distance = 50 ; localStorage.setItem('distance',distance); }
	$('#distance').val(distance).slider('refresh');

	$('#price').change(function(){ localStorage.setItem("price",$(this).val());});
	price = localStorage.getItem("price");
	if (typeof price == 'undefined' ) {price = 40 ; localStorage.setItem('price',price); }
	$('#price').val(price).slider('refresh');
	
}

function onMapLoad() {
	if (isConnected) getGeolocation() ;
	else	alert("Must be connected to the Internet");
}

function getGeolocation() {
	// get the user's gps coordinates and display map
	var options = {
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: false
	};

	if (address_source == 'useGPS') navigator.geolocation.getCurrentPosition(loadMap,geoError, options);
	else {
		var geocoder = new google.maps.Geocoder(); 
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				loadMap1(results[0].geometry.location);
			}
			else  alert("Geocode was not successful for the following reason: " + status);
		});
	}
}


function loadMap(position){
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	loadMap1(latlng);
}

function loadMap1(latlng) { 
	//$.mobile.changePage("#map", { transition: "fade", changeHash: true });
	if (app) navigator.splashscreen.hide();
	$('#map_canvas').height($(window).height() - $('#footer').height()-20);
	var myOptions = {
		zoom: 17,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	var mapObj = document.getElementById("map_canvas");
	var map = new google.maps.Map(mapObj, myOptions);
	var marker = new google.maps.Marker({position: latlng, map: map,title:"You are here, may be."});
	codeLatLng(latlng);
}

var city,formatted_address;
function codeLatLng(latlng) {
 geocoder = new google.maps.Geocoder();
 geocoder.geocode({
    'latLng': latlng
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        formatted_address =results[0].formatted_address;
		city = results[6].formatted_address;
		var txt = 'Your position was determinated ';
		if (address_source == 'useGPS') txt=txt+ 'using GPS.';
		else txt=txt+ 'using address provided.';
		txt = txt+'\n Seems you are at '+formatted_address+'.';
		txt= txt+'\nYou can change method of geolocation in settings tab.'
		alert(txt);
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}

function geoError(error) {
	alert('code: ' + error.code + '\nmessage: ' + error.message + '\n');
}


function exitApp(){
	var act_page = '#'+$.mobile.activePage.attr('id')+' ';
	var active = $(act_page+'.ui-btn-active');
	$(active).removeClass('ui-btn-active');
	console.log(active);
	$( act_page +'#exit_btn').addClass('ui-btn-active');
	if (confirm("Are you sure you want to exit?"))  return doExit();
	else {
		$(act_page+'#exit_btn').removeClass('ui-btn-active');
		$(active).addClass('ui-btn-active');
		$(active).focus();
	}
}

function doExit(){
	if(navigator.app){navigator.app.exitApp();}
	if(navigator.device){navigator.device.exitApp();}
	return true;
}

/***********************
.ajax_loader {background: url("spinner_squares_circle.gif") no-repeat center center transparent;width:100%;height:100%;}
.blue-loader .ajax_loader {background: url("ajax-loader_blue.gif") no-repeat center center transparent;}
var box2;
$(".box-2").live('click', function(){	
		box2 = new ajaxLoader(this, {classOveride: 'blue-loader'});
	});
	
box2.remove()
***********************/


function ajaxLoader (el, options) {
	// Becomes this.options
	var defaults = {
		bgColor 		: '#fff',
		duration		: 800,
		opacity			: 0.7,
		classOveride 	: false
	}
	this.options 	= jQuery.extend(defaults, options);
	this.container 	= $(el);
	
	this.init = function() {
		var container = this.container;
		// Delete any other loaders
		this.remove(); 
		// Create the overlay 
		var overlay = $('<div></div>').css({
				'background-color': this.options.bgColor,
				'opacity':this.options.opacity,
				'width':container.width(),
				'height':container.height(),
				'position':'absolute',
				'top':'0px',
				'left':'0px',
				'z-index':99999
		}).addClass('ajax_overlay');
		// add an overiding class name to set new loader style 
		if (this.options.classOveride) {
			overlay.addClass(this.options.classOveride);
		}
		// insert overlay and loader into DOM 
		container.append(
			overlay.append(
				$('<div></div>').addClass('ajax_loader')
			).fadeIn(this.options.duration)
		);
    };
	
	this.remove = function(){
		var overlay = this.container.children(".ajax_overlay");
		if (overlay.length) {
			overlay.fadeOut(this.options.classOveride, function() {
				overlay.remove();
			});
		}	
	}
}