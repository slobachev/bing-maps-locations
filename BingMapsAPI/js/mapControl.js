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
    var mapOptions = {
        credentials: apiKey,
        theme: new Microsoft.Maps.Themes.BingTheme(),
        center: new Microsoft.Maps.Location(50.449818, 30.524424),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 7
    };
    map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), mapOptions);
}

function SearchModuleLoaded() {
    // *** Add your source code here ***

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

// *** Add your source code here ***