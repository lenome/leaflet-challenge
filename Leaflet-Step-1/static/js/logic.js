// Create our map
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5
    });
// Define satellite map layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: api_key
  }).addTo(myMap);

//Query URL to the GeoJSON of the weekly earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    console.log("Creating features...");
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing details of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>\
        <hr><p><b>Magnitude:</b> " + feature.properties.mag + "</p><hr><p><b>Location:</b> " + feature.properties.place) + "</p>";
    }
  
    //Function that assigns a color according to the magnitude of an earthquake
    function getcolor(magnitude){
        switch (true) {
            case magnitude>5:
                return "red";
            case magnitude>=4:
                return "orangered";
            case magnitude>=3:
                return "orange";
            case magnitude>=2:
                return "yellow";
            case magnitude>=1:
                return "greenyellow";
            case magnitude>=0:
                return "green"   
            default:
                return "silver";
        }
    }

    //Function that gets the radius according to the magnitude to plot relative strength of the earthquake
    function getradius(magnitude){
        return magnitude*5;
    }
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    L.geoJSON(earthquakeData, {
                   
      onEachFeature: onEachFeature,
      //Change the default marker to a circle marker that calls the getcolor and getradius functions according to each earthquake's magnitude
      pointToLayer: function (feature, latlng) {
                var magnitude = feature.properties.mag;
                return new L.circleMarker(latlng, {
            color: "Black",
            weight: 1,
            fillColor: getcolor(magnitude),
            radius: getradius(magnitude),
            fillOpacity: 1
        });
      }
    //Adds the earthquake layer to the map
    }).addTo(myMap);


  // create legend
  var legend = L.control({position: "bottomright"});
  // layer control added, insert div with class legend
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),   
      //Make a list of the hex code values of the colors used in getcolors
      mags = ["#008000", "#ADFF2F", "#FFFF00", "#FFA500", "#FF4500", "#FF0000" ],
      //List of labels for each of the different magnitude values
      labels = ["0-1","1-2","2-3","3-4","4-5","5+"]; 
    // loop through the length of the mags list and add each color to the legend

    for (var i = 0; i < mags.length; i++) {
        console.log(mags[i] + labels[i]);
        div.innerHTML +=
           '<i style="background:' + mags[i] + '"></i> ' +
           labels[i] + '<br>';
    }
    return div; 
  };
  // add legend to map
  legend.addTo(myMap);
  }


