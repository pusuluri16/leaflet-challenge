//Define the url for geoJson Url for the earthquake data
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Add tilelayer to the map
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  );

//create the map
let map = L.map("map",
    {
        zoom : 5,
        center : [6.8883, -73.0733]
    }
); 
streetmap.addTo(map);

// Retrive and add the earthquake data
d3.json(earthquakeUrl).then(
    function(earthquakeData){
        console.log(earthquakeData);
        function mapstyle(feature){
            //console.log(feature);
            return{
                fillColor: mapColor(feature.geometry.coordinates[2]),
                radius: mapRadius(feature.properties.mag),
                stroke: true,
                fillOpacity: 1,
                opacity: 1,
                weight: 0.5,
                color: "black"
            };
            
        }
        //set the color for depth
        function mapColor(depth){
            //console.log(depth);
            switch(true){
                case depth > 90:
                    return "red";
                case depth > 70:
                    return "orangered";
                case depth > 50:
                    return "orange";
                case depth > 30:
                    return "gold";
                case depth > 10:
                    return "yellow";
                default:
                    return "lightgreen";                    
            }
        }
        // set the size for magnitude
        function mapRadius(mag){
            //console.log(mag);
            if (mag === 0){
                return 1;
            }
            return mag * 4;
        }
        //Add earthquake data to the map
        let circleMarker = L.geoJson(earthquakeData,{
            pointToLayer: function(feature,latlng){
                return L.circleMarker(latlng);
            },
            style: mapstyle,

            //Activate pop-up data when circles are clicked
            onEachFeature: function(feature, layer){
                layer.bindPopup("Magnitude:" + feature.properties.mag + "<br>Location:"+feature.properties.place + "<br>Depth:"+feature.geometry.coordinates[2]);

            }

        })
        circleMarker.addTo(map);

    //set up the legend
     let legend = L.control({position:"bottomright"});
     legend.onAdd = function(map){
         let div =L.DomUtil.create("div", "info legend"),
         depth = [-10,10,30,50,70,90],
         labels = [];

 // loop through density intervals and generate a label with a colored square for each interval
         for (let i = 0; i < depth.length; i++) {
         div.innerHTML +=
            '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
      
  }
);




