function analyzeEuclidean() {
		var demographic_div = document.getElementById('demographic_analysis');
    	var euclidean_div = document.getElementById('euclidean_analysis');
    	demographic_div.style.display = 'none';
    	euclidean_div.style.display = "block";

		var y = document.getElementById("myText").value;
		var num_clusters = parseInt(y);

		var cluster_selected = lastCluster;

		var geodesic_crime_data = eval("crimes_geodesic_" + num_clusters);
		var euclidean_crime_data = eval("crimes_euclidean_" + num_clusters);

	    var cluster_data = new Array(num_clusters);
		var euclidean_data = new Array(num_clusters).fill(0);

		//initialize cluster data
		for(var m=0; m < cluster_data.length; m++){
		    cluster_data[m] = {'num_clusters': 0,
							   'clusters': new Array(num_clusters),
							   'num_points': 0
							   }
			for(var p = 0; p < num_clusters; p++){
		        cluster = m.toString();
		        cluster_data[m]['clusters'][p] = {'cluster': p,
												  'count': 0}
			}
		}

		//boolean for first run through euclid data
		var euclid_bool = true;
		for (var i=0; i <= geodesic_crime_data['features'].length - 1; i++){
			for (var j=0; j <= euclidean_crime_data['features'].length - 1; j++) {
			    var geo_crime = geodesic_crime_data['features'][i]['geometry']['coordinates'];
			    var euclid_crime = euclidean_crime_data['features'][j]['geometry']['coordinates'];

			    //if the geodesic coordinates match the euclidean coordinates
			    if (geo_crime[0] == euclid_crime[0] && geo_crime[1] == euclid_crime[1]) {
			        //clusters of respective points
			        var euclid_cluster = euclidean_crime_data['features'][j]['properties']['cluster'];
			        var geo_cluster = geodesic_crime_data['features'][i]['properties']['cluster'];

			        if(cluster_data[geo_cluster]['clusters'][euclid_cluster]['count'] == 0)
			            cluster_data[geo_cluster]['num_clusters'] += 1;

					cluster_data[geo_cluster]['clusters'][euclid_cluster]['count'] += 1;
					cluster_data[geo_cluster]['num_points'] += 1;

			    	if(euclid_bool = true)
			        	euclidean_data[euclid_cluster] += 1;
			    }
			}
			euclid_bool = false;
		}

		var data_string = ""
		document.getElementById("stats").innerHTML = "";

		//build pie chart of euclidean clusters
		var pie_data_values = new Array(num_clusters);
		var remaining_values = new Array(num_clusters);
		var pie_data_names = new Array(num_clusters);
		var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'cyan', 'brown']

		for (var i=0; i < pie_data_names.length; i++){
			if (cluster_data[cluster_selected]['clusters'][i]['count'] > 0){
				pie_data_values[i] = cluster_data[cluster_selected]['clusters'][i]['count'];
				remaining_values[i] = euclidean_data[i] - cluster_data[cluster_selected]['clusters'][i]['count'];
		    	pie_data_names[i] = "Cluster " + i.toString() + " (" + colors[i] + ")";
			}

		}

		var trace1 = {
  			x: pie_data_names,
  			y: pie_data_values,
  			name: 'Matching cluster points',
  			type: 'bar',
		};

		var trace2 = {
  			x: pie_data_names,
  			y: remaining_values,
  			name: 'Different cluster points',
  			type: 'bar',
		};

var data = [trace1, trace2];

var layout = {barmode: 'stack'};

Plotly.newPlot('myDiv', data, layout);

		data_string += "Percent of euclidean cluster points in this cluster: <br />"
		var euclid_cluster_count = 0;
		var sim_score = 0;
		var confusion_data = [];

		for(var i=0; i < num_clusters; i++){
		    if(cluster_data[cluster_selected]["clusters"][i]["count"] != 0){
		        euclid_cluster_count += 1;
				var cluster_ratio = cluster_data[cluster_selected]["clusters"][i]["count"] / euclidean_data[i] * cluster_data[cluster_selected]["clusters"][i]["count"] / cluster_data[cluster_selected]["num_points"];
		    	sim_score += cluster_ratio;
		    }

		    var pct = Math.round(cluster_data[cluster_selected]["clusters"][i]["count"] / euclidean_data[i] * 100);
		    //predicted geodesic, actual not geodesic
		    confusion_data[0] = euclidean_data[i] - cluster_data[cluster_selected]["clusters"][i]["count"];
		    //predicted geogesic, actual geodesic
			confusion_data[1] = cluster_data[cluster_selected]["clusters"][i]["count"];
		    if (pct > 0)
		    	data_string += "<b>Cluster " + i.toString() + ":</b> " + pct.toString() + "%<br />";
		}

		data_string += "<br /><br /><b>Simliarity Score: </b>" + sim_score.toString();
		data_string += "<br />***Similarity score is calculated by weighting the percentage of each euclidean cluster found in the geodesic cluster. Weight is based on number of euclidean points in the cluster vs total number of euclidean points for that cluster";

		document.getElementById("stats").innerHTML = data_string;

	}