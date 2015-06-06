//$(window).bind("load", onDeviceReady);
document.addEventListener("deviceready", onDeviceReady, false);

$('#map').bind('pageshow',function(event, ui){ getGeolocation();} );

var isConnected = false;
function onDeviceReady() {
	isConnected = true;
	document.addEventListener("backbutton", function (e) {
        if($.mobile.activePage.is('#login_page')){
			e.preventDefault();
		}
		else {
			exitApp()
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
		} 
		else {
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
	navigator.splashscreen.hide();
	$.mobile.changePage("#map", { transition: "fade", changeHash: true });
	$('#map_canvas').height($(window).height() - $('#footer').height()-20);
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
	var act_page = '#'+$.mobile.activePage.attr('id')+' ';
	var active = $(act_page+'.ui-btn-active');
	$(active).removeClass('ui-btn-active');
	$( act_page +'#exit_btn').addClass('ui-btn-active');
	if (confirm("Are you sure you want to exit?")) navigator.app.exitApp();
	
	$(act_page+'#exit_btn').removeClass('ui-btn-active');
	$(active).addClass('ui-btn-active');
	
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
