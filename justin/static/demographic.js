function analyzeDemographic(cluster_selected){

    var demographic_div = document.getElementById('demographic_analysis');
    var euclidean_div = document.getElementById('euclidean_analysis');
    demographic_div.style.display = 'block';
    euclidean_div.style.display = "none";

    if(cluster_selected == undefined){
        cluster_selected = lastCluster;
    }

    lastCluster = cluster_selected;

    var y = document.getElementById("myText").value;
    var num_clusters = parseInt(y);

    var labels = ['White', 'Black or African American', 'American Indian and Ala Native', 'Native Hawaiian\/other Pac Isl', 'Asian', 'Multiple Race', 'Other Race'];
    var data = [];
    for(var i=0; i<num_clusters; i++){
        data[i] = [];
    }

    var stats = {};
    for(var i=0; i < labels.length; i++){
        stats[labels[i]] = 0;
    }

    buildDemographicData(data);

    var total = 0;
    for(var i=0; i<data[cluster_selected].length; i++){
        for(var j=0; j<labels.length; j++){
            stats[labels[j]] += Math.round(data[cluster_selected][i][labels[j]]);
            total += data[cluster_selected][i][labels[j]];
        }
    }

    var percentages = [];
    for(var i=0; i<labels.length; i++){
        //document.getElementById("demographic_stats").innerHTML += "Percent " + labels[i] + ": " + (stats[labels[i]]/total*100).toFixed(2) + "%<br />";
        percentages.push((stats[labels[i]]/total*100).toFixed(2));
    }

    var stats_data = [{
        type: 'bar',
        x: percentages,
        y: labels,
        orientation: 'h',
        name: 'Percent of population',
        text: percentages,
        hoverinfo: 'none',
        textposition: 'auto',
    }];

    var layout ={
        title: 'Demographics Overview',
        xaxis: {
            title: 'Percent of Population',
            titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
        }
  },
    };

    Plotly.newPlot('demo_stats', stats_data, layout);

    clustermap(cluster_selected, data);
}

function buildDemographicData(cluster_tracts) {
    var x = document.getElementById("myText").value;
    var num_clusters = parseInt(x);

    for(var i=0; i < num_clusters; i++){
        var geodesic_crime_data = eval("geodesic_cluster_" + num_clusters + '_' + i);
        var cluster_vector = geodesic_crime_data['geometry']['coordinates'][0];

        //loop through each tract
        for(var j=0; j<zipcodes['features'].length; j++){
            var tract_vector = zipcodes['features'][j]['geometry']['coordinates'][0];
            var tract_num = zipcodes['features'][j]['properties']['TRACTCE10'];

            var partial_tract = [];
            //check if each point of the boundary of the tract is inside of the cluster
            for(var k=0; k<tract_vector.length; k++){
                if (inside(tract_vector[k], cluster_vector)){
                    partial_tract.push(tract_vector[k]);
                }
            }
            partial_tract.push(partial_tract[0]);

            //get areas of the tracts found in the cluster
            var partial_area = calcPolygonArea(partial_tract);
            var full_area = calcPolygonArea(tract_vector);

            if (partial_area > 0 && full_area > 0){
                cluster_tracts[i].push({
                    'tract_num': tract_num,//.replace(/^0+/, ''),
                    'ratio': partial_area / full_area,
                    'White': zipcodes['features'][j]['properties']['White'] * partial_area/full_area,
                    'Black or African American': zipcodes['features'][j]['properties']['Black or African American'] * partial_area/full_area,
                    'American Indian and Ala Native': zipcodes['features'][j]['properties']['American Indian and Ala Native'] * partial_area/full_area,
                    'Native Hawaiian\/other Pac Isl': zipcodes['features'][j]['properties']['Native Hawaiian\/other Pac Isl'] * partial_area/full_area,
                    'Multiple Race': zipcodes['features'][j]['properties']['Multiple Race'] * partial_area/full_area,
                    'Asian': zipcodes['features'][j]['properties']['Asian'] * partial_area/full_area,
                    'Other Race': zipcodes['features'][j]['properties']['Other Race'] * partial_area/full_area
                });
            }
        }
    }
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function calcPolygonArea(vertices) {
    var total = 0;

    if(vertices.length == 0){
        return 0;
    }

    for (var i = 0, l = vertices.length; i < l; i++) {
        if (vertices[i] == null){
            continue;
        }

      var addX = vertices[i][0];
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
      var subY = vertices[i][1];

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}

function clustermap(selectedCluster, tractData){
	var labels = ['White', 'Black or African American', 'American Indian and Ala Native', 'Native Hawaiian\/other Pac Isl', 'Asian', 'Multiple Race', 'Other Race'];

	var x = document.getElementById("myText").value;
    var num_clusters = parseInt(x);

    if (mymapgeojson != 0) {
			mymapgeojson.eachLayer(function(layer) {
  				mymapgeojson.removeLayer(layer);
			});
		}

    if (clustergeojson != 0) {
			clustergeojson.eachLayer(function(layer) {
  				clustergeojson.removeLayer(layer);
			});
		}

	function onEachFeature(feature, layer) {
		var popupContent = "<p></p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

	tractList = {"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4269" } }, "features": []};

	for(var i=0; i<tractData[selectedCluster].length; i++){
	    for(var j=0; j<zipcodes['features'].length; j++){
	        if (zipcodes['features'][j]['properties']['TRACTCE10'] == tractData[selectedCluster][i]['tract_num']){
	            tractList['features'].push(zipcodes['features'][j]);
            }
        }
    }

    clustergeojson = L.geoJSON([eval("geodesic_cluster_" + x + "_" + selectedCluster)], {
		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: feature.properties.fillColor,
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
		}).addTo(mymap);

    //build alderban districts
	mymapgeojson = L.geoJSON([tractList], {
		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: function onEachFeat(feature, layer){
		    var popupContent = "<p></p>";
		    popupContent += 'Tract #' +feature['properties']['TRACTCE10'] + "<br />";
		    var total = 0;
		    for(var i=0; i<labels.length; i++){
		        total += feature['properties'][labels[i]];
            }

            for(var j=0; j<labels.length; j++){
		        popupContent += 'Percent ' + labels[j] + ': ' + ((feature['properties'][labels[j]] / total).toFixed(4) * 100) + '%<br />';
            }

			layer.bindPopup(popupContent);
		},

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: feature.properties.fillColor,
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	}).addTo(mymap);
}
