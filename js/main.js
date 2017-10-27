/*
Main.js

1. Retrieve geolocation
2. On callback with lat and lon, store in JSON, load map
3. Fade map in to background

Notes: To prevent delays, the map is always 1 load behind the user // TODO: fix this? 
can't hide map, too many issues with fade in;

*/

// Temp hardcoded variables
let pageStylePreference = "light"; // Hardcoded for now
let userName = "Ryder Damen";





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
	
	//pageStylePreference = chrome.storage.sync.get(['pageStyle'], function (result) { return result; });
	// TODO: Fix this, retrieve a global variable from JSON or write them
	
	// Handling Dark Styling
	if (pageStylePreference == "dark") {
		document.getElementById('html').className = 'dark';
		document.getElementById('overlay').className = 'dark-overlay';
		document.getElementById('map-cover').className = 'dark-map-cover';
	}
	
	// Setting User Name
	document.getElementById('name').innerHTML = userName;
	
	// Setting Date
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December" ];
	document.getElementById("date").innerHTML = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
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
    
    // Add a listener to fade the cover out after the map is loaded
    google.maps.event.addListenerOnce(map, 'idle', function(){ 
    	$(".map-cover").fadeOut(2000);
    	$(".dark-map-cover").fadeOut(2000);
	});
}
      
      
function writeLatitudeLongitude(lastLat, lastLon) {
    if (!lastLat) {
      console.log("Error: No latitude or longitude");
      return;
    }        
    chrome.storage.sync.set({'lastLat': lastLat, 'lastLon': lastLon}, function() {});
}


function writeUserPreferences() {
	if (!pageStylePreference) {
          console.log("Error: No user preferences to save");
          return;
        }        
        chrome.storage.sync.set({'pageStyle': pageStylePreference}, function() {
          console.log("New user preferences saved");
        });
}
      
     
function positionCallback(position) {
	// This method is called back after a delay of around 3 seconds
	if (!position.coords.latitude) { return; }
	writeLatitudeLongitude(position.coords.latitude, position.coords.longitude);	    
}

