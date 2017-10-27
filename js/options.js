/*
Main.js

1. Retrieve geolocation
2. On callback with lat and lon, store in JSON, load map
3. Fade map in to background

Notes: To prevent delays, the map is always 1 load behind the user // TODO: fix this? 
can't hide map, too many issues with fade in;

// Users should be able to choose their own zoom level


*/

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

