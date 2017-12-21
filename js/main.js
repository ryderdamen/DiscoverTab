/*
Main.js
Version: 1.1
Author: Ryder Damen
ryderdamen.com/discovertab

Page Overview:
1. Retrieves user preferences from storage (as set by the options page)
2. Sets variable CSS classes based on those stored preferences
3. Sets variable HTML objects based on stored preferences
4. Retrieves the last known position of the user, and uses it to implement a google map; fades the map when implemented
5. Retrieves the currrent known position of the user, and stores if for next time.

// NB: We are retriving the last known position of the user, because the callback for the current location is far too long (3 seconds)

*/


// Page Initialization
initializePage();


// Functions -------------------------------------------------------------------------------------------------------------

function initializePage() {
	// Initializes the page by retrieving preferences from storage
	chrome.storage.sync.get(
	[	'discoverTabTheme',
		'discoverTabUserName',
		'discoverTabZoom',
		'discoverTabGmapsApiKey',
		'discoverTabRandomMode'
	], function (stored) {
		// Now that we have the variables, continue with loading:
		if (stored.discoverTabUserName === undefined) {
			// This is our first time loading
			constructPage("", 0, 15, "", false);
		}
		else {
			constructPage(stored.discoverTabUserName, stored.discoverTabTheme, stored.discoverTabZoom, stored.discoverTabGmapsApiKey, stored.discoverTabRandomMode);
		}
		
		
	});
}

function constructPage(userName, theme, zoom, apiKey, randomMode) {
	// Constructs the actual page, and applies variable classes
	
	if (theme == 1) { // Dark Theme Class Applications
		document.getElementById('html').className = 'dark';
		document.getElementById('overlay').className = 'dark-overlay';
		document.getElementById('map-cover').className = 'dark-map-cover';
	}
	
	// Set Username
	document.getElementById('name').innerHTML = userName;
	
	// Retrieve and Set Date
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December" ];
	document.getElementById("date").innerHTML = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	
	// Retrieve the user's location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(userLocated);
	}
	else {
		console.log('Sorry, Geolocation is not supported for your browser or operating system :(');
	}
	
	// Retrieve the last known latitude and longitude variables
	chrome.storage.sync.get(['lastLat','lastLon'], function (result) {
		if (randomMode) {
			// If we're in random mode, return a random lat/lon from the places array
			var randomPlace = places[Math.floor(Math.random() * places.length)];
			document.getElementById('cityName').innerHTML = randomPlace.city + ", " + randomPlace.state;
			initializeGoogleMap(Number(randomPlace.latitude), Number(randomPlace.longitude), 12, theme, apiKey);
			return;
		}
		if (!result.lastLat) {
			// If we don't have any stored lat/lons, show Toronto, because it's the developer's home and it's pretty
			initializeGoogleMap(43.6425662, -79.3892508, 12, theme, apiKey);
			return;
		}
		else {
			initializeGoogleMap(result.lastLat, result.lastLon, zoom, theme, apiKey);
			return;
		}
    });
}

function userLocated(position) {
	// This method is called back after a delay of around 3 seconds
	if (!position.coords.latitude) { return; }
	// Writes the latitude and longitude to storage (preferences)
	chrome.storage.sync.set({'lastLat': position.coords.latitude, 'lastLon': position.coords.longitude}, function() {});	
}

function initializeGoogleMap(lat, lon, zoomLevel, theme, apiKey) {
	// First, get the google maps script with the user's API Key
	$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + apiKey, function( data, textStatus, jqxhr ) {	 	
		// Then, initialize the map
		if (theme == 0) {
			mapStyling = mapStyleLight;
		}
		else {
			mapStyling = mapStyleDark;
		}
	    var centre = {lat: lat, lng: lon};
	    var map = new google.maps.Map(document.getElementById('map'), {
	      zoom: Number(zoomLevel),
	      center: centre,
	      disableDefaultUI: true,
	      styles: mapStyling
	    });
	    
	    // Add a listener to fade the cover out after the map is loaded
	    google.maps.event.addListenerOnce(map, 'idle', function(){ 
	    	$(".map-cover").fadeOut(2000);
	    	$(".dark-map-cover").fadeOut(2000);
		});
	});
	
}
      
