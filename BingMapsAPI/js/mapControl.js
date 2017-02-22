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
    // *** Add your source code here ***
}

function CallRestService(request) {
    // *** Add your source code here ***
}

function DataSourceCallback(response, userdata) {
    // *** Add your source code here ***
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
        //Pin the map to the results
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