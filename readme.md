# WanderTab
A simple, map-based, new tab extension for Google Chrome.

## TODO
* Create light and dark themes
* Remove buttons from GMAPS
* Rename
* Initialize repository
* Add in tracking
* Move API keys and tracking keys to gitIgnore
* Implement a gmap saving feature
	* Only request a new map if
		* The user has moved a considerable distance from their original position
			(build algo)
		* Otherwise; use the same map (cache if possible);
			* caching must be maximum of 30 days
			* caching must keep google auth
			