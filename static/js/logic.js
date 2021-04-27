// Creating map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Store API query variables
  var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  
  // Assemble API query URL
  var url = baseURL;
  var geojson;
  // Grab the data with d3
  d3.json(url).then(function(response) {
    equ_data = response.features;
    console.log(equ_data);

    for (var i = 0; i < equ_data.length; i++) {
        var location = equ_data[i].geometry;

        // Conditionals for earthquake circle color
        var color = "green";
        if (location.coordinates[2] >= -10) {
            color = "#73E143";
            }
        if (location.coordinates[2] > 10) {
            color = "#dcf400";
            }
        if (location.coordinates[2] > 30) {
            color = "#f7db11";
            } 
        if (location.coordinates[2] > 50) {
            color = "#fdb829";
            }
        if (location.coordinates[2] > 70) {
            color = "#fca35d";
            }
        if (location.coordinates[2] > 90) {
            color = "#ff5f65";
        }

        L.circle([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 0.75,
        color: "#87b05b",
        fillColor: color,
        // Adjust radius
        radius: equ_data[i].properties["mag"]*18000
        }).bindPopup("<h2> size:" +  equ_data[i].properties["mag"] + "</h2> <hr> <h3>deep: " + location.coordinates[2] + "</h3>").addTo(myMap);
    }
});

  // // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = [];

    colors.push("<div><span style=\"background-color: #A3F600;display: inline-block;height: 10px;margin-right: 5px;width: 10px;\"></span>-10-10</div>");
    colors.push("<div><span style=\"background-color: #DCF400;display: inline-block;height: 10px;margin-right: 5px;width: 10px;\"></span>10-30</div>");
    colors.push("<div><span style=\"background-color: #F7DB11;display: inline-block;height: 10px;margin-right: 5px;width: 10px;\"></span>30-50</div>");
    colors.push("<div><span style=\"background-color: #FDB72A;display: inline-block;height: 10px;margin-right: 5px;width: 10px;\"></span>50-70</div>");
    colors.push("<div><span style=\"background-color: #FCA25D;display: inline-block;height: 10px;margin-right: 5px;width: 10px;\"></span>70-90</div>");
    colors.push("<div><span style=\"background-color: #FF5F65;display: inline-block;height: 10px;margin-right: 5px;width: 10px;\"></span>90+</div>");
    div.innerHTML += "<ul>" + colors.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);