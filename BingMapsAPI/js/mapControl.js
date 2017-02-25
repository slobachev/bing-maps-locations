var map = null;

var queryInput = null;
var queryButton = null;

var whatInput = null;
var whereInput = null;
var searchButton = null;

var dataSourceInput = null;
var dataSourceButton = null;

var searchManager = null;

var apiKey = "As2Kkun_JzX_oW3SS1OogeVp_g7iffuoz99Q7GkUYthMlzk9UJ17Tywhg1rfbTkS";

window.onload = InitMap;

function InitMap() {
    //Get HTML elements
    queryInput = document.getElementById('txtQuery');
    queryButton = document.getElementById('btnGeocode');

    whatInput = document.getElementById('txtWhat');
    whereInput = document.getElementById('txtWhere');
    searchButton = document.getElementById('btnSearch');

    dataSourceInput = document.getElementById('txtDataSource');
    dataSourceButton = document.getElementById('btnDataSource');

    Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme',
        { callback: ThemesModuleLoaded });
}

function ThemesModuleLoaded() {
    let mapOptions = {
        credentials: apiKey,
        theme: new Microsoft.Maps.Themes.BingTheme(),
        center: new Microsoft.Maps.Location(50.449818, 30.524424),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 7
    };
    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);
    //Load the search module
    Microsoft.Maps.loadModule('Microsoft.Maps.Search',
        { callback: SearchModuleLoaded });
}

function SearchModuleLoaded() {
    searchManager = new Microsoft.Maps.Search.SearchManager(map)

    //Enable search buttons
    queryButton.disabled = false;
    searchButton.disabled = false;
    dataSourceButton.disabled = false;
}

function ClickDataSource(credentials) {
    map.getCredentials(MakeDataSourceRequest);
}

function MakeDataSourceRequest(credentials) {
    //Construct a REST request
    var request =
        "http://spatial.virtualearth.net/REST/v1/data/20181f26d9e94c81acdf9496133d4f23/FourthCoffeeSample/FourthCoffeeShops?spatialFilter=nearby('";
    request += dataSourceInput.value; //Add input text to request
    request += "',5.0)";               //5 km search radius
    request += "&$select=*";          //Get all result info from source
    request += "&$format=json";       //Return data in JSON format
    request += "&jsonp=DataSourceCallback";//DataSourceCallback w/results
    request += "&key=" + credentials; //Use API key for this request
    request = encodeURI(request);
    CallRestService(request);
}

function CallRestService(request) {
    //Create a "script" where the source is our REST endpoint
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", request);

    //Attach script to the document, which immediately runs it
    document.body.appendChild(script);
}

function DataSourceCallback(response, userdata) {
    //Clear previous pins
    map.entities.clear();

    let results = response.d.results;
    if (results.length == 0) {
        alert("No results found.");
    }

    //Initialize a location array to move the map to the results
    let locations = [];

    //Loop through results
    for (var i = 0; i < results.length; i++) {
        let result = results[i];

        //Convert location data into a format we can use to move the map
        let location = { latitude: result.Latitude, longitude: result.Longitude };
        locations.push(location);

        //Create an infobox containing display name and phone number
        let pinInfobox = new Microsoft.Maps.Infobox(location,
            {
                title: result.DisplayName,
                description: result.Phone
            });

        //Create a pushpin at the location
        let pushpin = new Microsoft.Maps.Pushpin(location,
            { text: (i + 1).toString(), infobox: pinInfobox });

        //Add infobox and pushpin to map
        map.entities.push(pushpin);
        map.entities.push(pinInfobox);
    }
    //Pan the map if we got results
    if (results.length > 0) {
        //Use a bounding box constructed from all found locations
        map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations(locations) });
    }
}

function ClickSearch() {
    let searchRequest = {
        what: whatInput.value,
        where: whereInput.value,
        count: 20,
        callback: SearchCallback
    };
    searchManager.search(searchRequest);
}

function SearchCallback(searchResponse, userData) {
    //Clear previous pins
    map.entities.clear();

    if (searchResponse.searchResults.length > 0) {
        //Pan the map to the results
        map.setView({ bounds: searchResponse.searchRegion.mapBounds.locationRect });
    } else {
        alert("No results found");
    }

    //Loop through search results
    for (var i = 0; i < searchResponse.searchResults.length; i++) {
        let result = searchResponse.searchResults[i];

        //Make an infobox with name and address
        let pinInfobox = new Microsoft.Maps.Infobox(result.location,
            {
                title: result.name,
                description: result.address
            });

        //Make a pushpin at the location that brings up the infobox
        //Text on the pin is a number
        let pushpin = new Microsoft.Maps.Pushpin(result.location,
            {
                text: (i + 1).toString(),
                infobox: pinInfobox
            });

        //Add infobox and pushpin to map
        map.entities.push(pushpin);
        map.entities.push(pinInfobox);
    }
}

function ClickGeocode() {
    let geocodeRequest = {
        where: queryInput.value,
        count: 20,
        callback: GeocodeCallback
    };
    searchManager.geocode(geocodeRequest);
}

function GeocodeCallback(geocodeResults, userData) {
    //Clear previous pins
    map.entities.clear();

    if (geocodeResults.results.length > 0) {
        //Pan the map to the results
        map.setView({ bounds: geocodeResults.results[0].bestView });
    } else {
        alert("No results found.");
    }

    //Loop through results
    for (var i = 0; i < geocodeResults.results.length; i++) {
        let result = geocodeResults.results[i];

        //Create an infobox with name and latitude/logitude
        let pinInfobox = new Microsoft.Maps.Infobox(result.location,
            {
                title: result.name,
                description: result.location.latitude.toString() + ", " +
                    result.location.longitude.toString()
            });

        //Make a pushpin at the location that brings up the infobox
        //Text on the pin is a number
        let pushpin = new Microsoft.Maps.Pushpin(result.location,
            {
                text: (i + 1).toString(),
                infobox: pinInfobox
            });

        //Add infobox and pushpin to map
        map.entities.push(pushpin);
        map.entities.push(pinInfobox);
    }
}