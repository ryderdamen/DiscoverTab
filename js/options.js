/*
Options.js
Version: 1.1
Author: Ryder Damen
ryderdamen.com/discovertab

This allows users to set their personal options for the plugin
*/

// Lifecycle
onPageLoad();

// Listener for submit click (since no inline JS is allowed in chrome extensions)
document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() {
        onSubmit();
    });
});


// Functions

function onPageLoad() {
	// When the page is loaded
	
	// Load the Sample Map
	initializeGoogleMap(43.6425662, -79.3892508, 12, 0, "");
	
	
	// Retrieve variables from storage and write them to the view
	chrome.storage.sync.get(
		[
			'discoverTabTheme',
			'discoverTabUserName',
			'discoverTabZoom',
			'discoverTabGmapsApiKey',
			'discoverTabRandomMode',
		], function (stored) {
			
			// Handling undefined bugs on very first load
			if (stored.discoverTabUserName === undefined) {
				document.getElementById("userName").value = "";
			}
			else {
				document.getElementById("userName").value = stored.discoverTabUserName;	
			}
			
			if (stored.discoverTabGmapsApiKey === undefined) {
				document.getElementById("gmapsApiKey").value = "";
			}
			else {
				document.getElementById("gmapsApiKey").value = stored.discoverTabGmapsApiKey;
			}
			
			if (stored.discoverTabTheme == 1) { // Handling theme radio box checking
				document.getElementById("darkTheme").checked = true;
			}
			
			document.getElementById("zoom").value = stored.discoverTabZoom;
			document.getElementById("randomMode").checked = stored.discoverTabRandomMode;
	});
}

function goBack() {
	// Return to the previous window; should we save?
	window.history.back();
}

function onSubmit() {
	// When the submit button is pressed
	var username = document.getElementById("userName").value;
	var theme = document.querySelector('input[name="theme"]:checked').value;
	console.log("Theme:" + theme);
	
	var zoom = document.getElementById("zoom").value;
	var gmapsApiKey = document.getElementById("gmapsApiKey").value;
	var randomMode = document.getElementById("randomMode").checked;
	writePreferences(username, theme, zoom, gmapsApiKey, randomMode);
}

function writePreferences(username, theme, zoom, gmapsApiKey, randomMode) {
	// Writes preferences to chrome's storage, and to a javascript temp file
		// Save to chrome sync'd storage
        chrome.storage.sync.set({
	        'discoverTabTheme': theme,
	        'discoverTabUserName': username,
	        'discoverTabZoom' : zoom,
	        'discoverTabGmapsApiKey' : gmapsApiKey,
	        'discoverTabRandomMode' : randomMode
	        }, function() {		        
		        $("#submitButton").notify("Got it! Saved!", "success");
	        });	    
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
	    
	});
	
}


