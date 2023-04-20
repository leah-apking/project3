// Plotly Graphs with Drought Data

let url = "https://california-fire-data-if1l.onrender.com/api-drought"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);

    // Assign data to variables
    let drought = data.Features;
    let acres = drought.map(d => d.total_acres_burned);
    let none = drought.map(d => d.none_avg_pct);
    let d0 = drought.map(d => d.D0_avg_pct);
    let d1 = drought.map(d => d.D1_avg_pct);
    let d2 = drought.map(d => d.D2_avg_pct);
    let d3 = drought.map(d => d.D3_avg_pct);
    let d4 = drought.map(d => d.D4_avg_pct);
    let monthYear = drought.map(d => d.month_year);

    // Create trace for no drought
    let traceNone = {
      x: monthYear,
      y: none,
      name: "No Drought",
      type: "line",
      marker: {
          color: "blue"
      }
  };
    // Create traces1-4 for levels D1-D4 of drought
    let trace1 = {
        x: monthYear,
        y: d1,
        name: "D1: Moderate",
        type: "line",
        marker: {
            color: "#ffe11a"
        }
    };
    let trace2 = {
        x: monthYear,
        y: d2,
        name: "D2: Severe",
        type: "line",
        marker: {
            color: '#f8a500'
        }
    };
    let trace3 = {
        x: monthYear,
        y: d3,
        name: "D3: Extreme",
        type: "line",
        marker: {
            color: "#e76600"
        }
    };
    let trace4 = {
        x: monthYear,
        y: d4,
        name: "D4: Exceptional",
        type: "line",
        marker: {
            color: "#cd0402"
        }
    };

    // Assign all 4 traces to single line graph
    let lineData = [traceNone, trace1, trace2, trace3, trace4];
    let lineLayout = {
        title: `Drought Levels in California`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Percentage of California' }
    };

    // Create Plotly line graph
    Plotly.newPlot("line", lineData, lineLayout);

    // Define trace for bar graph showing total acres burned
    let traceBar = {
        x: monthYear,
        y: acres,
        text: acres,
        type: "bar",
        marker: {
            color: "#940408"},
        };
    
    let barData = [traceBar];
    let barLayout = {
        title: `Total Acres Burned per Month`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Total Acres Burned' }
    };

    // Create Plotly bar graph
    Plotly.newPlot("bar", barData, barLayout);
});

// Plotly Bar Graph with Wildfire Data

// Store a URL/ call api
var URL = "https://california-fire-data-if1l.onrender.com/api"

// Fetch the JSON data and console log it
d3.json(URL).then(
  function(data) {
    console.log(data);
  });

  // Use the D3 library to get all the data
  d3.json(URL).then((data) => {

    let allData = data.Features;

    // count the number of wildfires per county in a dataset
    let countyCount = allData.reduce((counts, d) => {
      if (counts[d.county]) {
        counts[d.county]++;
      } else {
        counts[d.county] = 1;
      }
      return counts;
    }, {});
    console.log(countyCount)

    // Sort counties by count in descending order
    let sortedCounties = Object.entries(countyCount)
    .sort((a, b) => b[1] - a[1])
    .map(pair => ({ county: pair[0], count: pair[1] }));

    console.log(sortedCounties);   
    
    // Slice the first 10 objects for plotting
    slicedData = sortedCounties.slice(0, 15);

    // Extract county names and counts as separate arrays for plotly
    let countyNames = slicedData.map(d => d.county);
    let countyCounts = slicedData.map(d => d.count);

    // Create trace for plotly
    let trace = [{
       x: countyNames,
       y: countyCounts,
       type: 'bar',
       marker: {      
          color: ['#940408',
            '#9a110a',
            '#9f1e0c',
            '#a52b0e',
            '#ab3811',
            '#b14513',
            '#b65215',
            '#bc5f17',
            '#c26c19',
            '#c7791b',
            '#cd861d',
            '#d39320',
            '#d9a022',
            '#dead24',
            '#e4ba26']}
      }];

    // Create layout object for plotly
    let layout = {
        title: 'Top 15 Wildfire Count by County',
        xaxis: { title: 'County' },
        yaxis: { title: 'Number of Wildfires' }
};

    // Plot the bar chart using plotly
    Plotly.newPlot('bar-chart', trace, layout);
  });


// Leaflet Map

function createMap(wildFires) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let mbAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      let mbUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      let satellite = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr});
  
   // Create a baseMaps object to hold the streetmap layer.
   var baseMaps = {
    "Street Map": streetmap,
    "Satellite View": satellite
  };
  
  // Create an overlayMaps object to hold the wildFires layer.
  var overlayMaps = {
    "Wildfires": wildFires
  };
  
  // Create the map object with options.
  var map = L.map("map", {
    center: [37.33, -119.85], //center on San Jose
    zoom: 6,
    layers: [streetmap, wildFires]
  });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(data) {
  
    // Pull the "incident_name" property from response.Features.
    var incidents = data.result[0].incident_name
    console.log(incidents)
    var Features = data.result
    // Initialize an array to hold fire markers.
    var FireMarker = [];
  
    // Loop through the fire array.
    for (var i = 0; i < Features.length; i++) {
      var incident = Features[i];
  
      var color = "";
      if (Features[i].acres_burned> 100000) {
        color = "#94090D";
      }
      else if (Features[i].acres_burned > 50000) {
        color = "#B23B07";
      }
      else if (Features[i].acres_burned > 25000) {
        color = "#CD6200";
      }
      else if (Features[i].acres_burned > 10000) {
        color = "#E38900";
      }
      else if (Features[i].acres_burned> 5000) {
        color = "#F4B200";
      }
      else {
        color = "#FFDC00";
      }
  
      // For each incident, create a marker, and bind a popup with the incident's name.
      var FireMarkers = L.circle([incident.latitude, incident.longitude],{
        fillOpacity: 0.75,
        color: color,
        fillColor: color,
        // Adjust the radius.
        radius: Math.sqrt(Features[i].acres_burned) * 75
      })
        .bindPopup("<h3>" + incident.incident_name + "<h3><h3>Acres Burned: " + incident.acres_burned + "</h3>");
  
      // Add the marker to the bikeMarkers array.
      FireMarker.push(FireMarkers);
    }
  
    // Create a layer group that's made from the fire markers array, and pass it to the createMap function.
    createMap(L.layerGroup(FireMarker));
  }
  
  // Perform an API call to the wild fire data to get the fire information. Call createMarkers when it completes.
  d3.json("https://california-wildfires-api-r6o6.onrender.com/api").then(createMarkers);
