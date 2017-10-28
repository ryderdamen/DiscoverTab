/*
Options.js
Version: 1.0
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
			
			document.getElementById("theme").value = stored.discoverTabTheme;
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
	var theme = document.getElementById("theme").value;
	var zoom = document.getElementById("zoom").value;
	var gmapsApiKey = document.getElementById("gmapsApiKey").value;
	var randomMode = document.getElementById("randomMode").checked;
	console.log('random: ' + randomMode);
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
		        // TODO, replace this with a toast or something
		        var button = document.getElementById("submitButton");
		        var originalBackgroundColor = button.style.backgroundColor;
		        var originalTextColor = button.style.color;
		        button.style.backgroundColor = "#00FF7F";
		        button.style.color = "#FFF";
		        setTimeout(function(){ 
			        button.style.backgroundColor = originalBackgroundColor;
					button.style.color = originalTextColor;
			         }, 300);
	        });	    
}


















/*





// First, get the preferences from settings...
let pageStylePreference = chrome.storage.sync.get(['pageStyle'], function (result) { return result; });
pageStylePreference = "light"; // Hardcoded for now


// Then, when the page loads...
window.onload = loadPage();

// Then, when the page is finished loading...
$( document ).ready(function() {
	// On document ready, retrieve last location variables and load the map
	chrome.storage.sync.get(['lastLat','lastLon'], function (result) {
		
		if (!result.lastLat) {
			// Display Toronto 43.6425662,-79.3892508
			initMap(43.6425662, -79.3892508);
		}
		else {
			initMap(result.lastLat, result.lastLon);
		}
    });
});


function loadPage() {
	// This method initializes and displays the date, and retrieves the user's location for the next load
	
	if (pageStylePreference == "dark") {
		document.getElementById('html').className = 'dark';
		document.getElementById('overlay').className = 'dark-overlay';
	}
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionCallback);
	}
	else {
		console.log('Sorry, Geolocation is not supported for your browser or operating system :(');
	}
}


function initMap(lat, lon) {
	// This method initalizes the map, simple user boilerplate
	
	
	if (pageStylePreference == "light") {
		
		mapStyling = mapStyleLight;
	}
	else {
		mapStyling = mapStyleDark;
	}
	
        var centre = {lat: lat, lng: lon};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: centre,
          disableDefaultUI: true,
          styles: mapStyling
                  });
                  
  
}
      
      
function writeLatitudeLongitude(lastLat, lastLon) {
    if (!lastLat) {
      console.log("Error: No latitude or longitude");
      return;
    }        
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'lastLat': lastLat, 'lastLon': lastLon}, function() {
      // Notify that we saved.
    });
}


function writeUserPreferences() {
	// This method writes user preferences to chrome sync'd storage
	let pageStyle = "light";
	if (!pageStyle) {
          console.log("Error: No user preferences to save");
          return;
        }        
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'pageStyle': pageStyle}, function() {
          // Notify that we saved.
          console.log("New user preferences saved");
        });
}
      
     
function positionCallback(position) {
	// this method is called back after a delay of around 3 seconds
	if (!position.coords.latitude) { return; }
	writeLatitudeLongitude(position.coords.latitude, position.coords.longitude);	    
}
*/

