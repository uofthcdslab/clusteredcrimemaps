function zeros(dim){
    var array = [];

    for(var i=0; i<dim[0]; ++i){
        array.push(dim.length == 1 ? 0 : zeros(dim.slice(1)));
    }

    return array;
}

function analyzeAllBias(){
    var radios = document.getElementsByName("choice");
    var len = radios.length;
    var clustersSelected = [];

    for( var i = 0; i < len; i++ ) {
        if(radios[i].checked) {
            clustersSelected.push(i + 2);
        }
    }

    var x = document.getElementById("myText").value;
    var num_clusters = parseInt(x);

    var y = document.getElementById("monthID").value;
    var monthID = parseInt(y);

    var year = document.getElementById("year").value;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var clusterBiasList = new Array(12).fill(0);
    var count  = 0;
    var cl = zeros([clustersSelected.length, 12]);
    for(var y=2005; y<2017; y++) {
        var biasScoreList = []
        for (var i = 0; i < clustersSelected.length; i++) {
            biasScoreList = getBiasIndex(clustersSelected[i], monthID, y);

            for(var j=0; j<biasScoreList.length; j++){
                cl[i][j] += biasScoreList[j];
            }
            count += 1;
        }
    }

    var finalBiasList = [];
    var y = [];
    for(var i=0; i<cl.length; i++){
        for(var j=0; j<12; j++){
            cl[i][j] = cl[i][j] / count;
        }

        finalBiasList.push({
                x: months,
                y: cl[i],
                type: 'scatter',
                name: clustersSelected[i],
            });
    }

    var options = {
        title: 'Potential Bias Index By Month Over Entire Dataset For Selected Clusters',
        xaxis: {
            title: 'Month',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
        yaxis: {
            title: 'Bias Index',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
    }

    Plotly.newPlot('biasPlot', finalBiasList, options);

    analyzeYearlyBias();
}

function analyzeYearlyBias(){
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'cyan', 'brown']

    var radios = document.getElementsByName("choice");
    var len = radios.length;
    var clustersSelected = [];

    for( var i = 0; i < len; i++ ) {
        if(radios[i].checked) {
            clustersSelected.push(i + 2);
        }
    }

    var x = document.getElementById("myText").value;
    var num_clusters = parseInt(x);

    var y = document.getElementById("monthID").value;
    var monthID = parseInt(y);

    var year = document.getElementById("year").value;

    if (clustersSelected.length < 1)
        clustersSelected.push(num_clusters);

    var clusterBiasList = [];

    var biasScoreList = [];
    for(var h=0; h<clustersSelected.length; h++) {
        var bias = [];
        for (var i = 2005; i < 2017; i++) {
            for (var j = 1; j < 13; j++) {
                var biasScoreList = getBiasIndex(clustersSelected[h], j.toString(), i.toString());
                for (var k = 0; k < biasScoreList.length; k++) {
                    bias.push(biasScoreList[k]);
                }
            }
        }
        clusterBiasList.push(bias);
    }


    //plot bias index
    var data = [];

    for(var i=0; i<clusterBiasList.length; i++){
        data.push({
            x: clusterBiasList[i],
            name: clustersSelected[i],
            type: 'histogram',
            opacity: 0.5,
        });
    }

    var layout = {barmode: "overlay",
                  title: "Potential Bias Histogram For Selected Clusters"
    };

    Plotly.newPlot('avgBiasPlot', data, layout);
}

function analyzeAllMonthlyBias(){
    var x = document.getElementById("myText").value;
    var num_clusters = parseInt(x);

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var y = document.getElementById("monthID").value;
    var monthID = parseInt(y);

    var year = document.getElementById("year").value;

    var data = [];
    for(var i=2005; i < 2017; i++){
        var biasScoreList = getBiasIndex(num_clusters, monthID, i);

        var trace1 = {
            x: months,
            y: biasScoreList,
            type: 'scatter',
            name: i.toString()
        };
        data.push(trace1);
    }

    var options = {
        title: 'Potential Bias Index By Month For ' + num_clusters + ' Clusters For 2005 - 2017',
        xaxis: {
            title: 'Month',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
        yaxis: {
            title: 'Potential Bias Index',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
    }

    Plotly.newPlot('biasPlot', data, options);
}

function analyzeBias(){
    var demographic_div = document.getElementById('demographic_analysis');
    var euclidean_div = document.getElementById('euclidean_analysis');
    var bias_div = document.getElementById('bias_analysis');
    demographic_div.style.display = 'none';
    euclidean_div.style.display = "none";
    bias_div.style.display = 'block';

    var x = document.getElementById("myText").value;
    var num_clusters = parseInt(x);

    var y = document.getElementById("monthID").value;
    var monthID = parseInt(y);

    var year = document.getElementById("year").value;

    var biasScoreList = getBiasIndex(num_clusters, monthID, year);

    //plot bias index
    var trace1 = {
        x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        y: biasScoreList,
        type: 'scatter'
    };

    var options = {
        title: 'Potential Bias Index By Month For ' + num_clusters + ' Clusters',
        xaxis: {
            title: 'Month',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
        yaxis: {
            title: 'Potential Bias Index',
            titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
            }
        },
    }

    var data = [trace1];

    Plotly.newPlot('biasPlot', data, options);

    //document.getElementById('biasResult').innerHTML = "Bias Index For " + current_cluster + " Clusters in " + months[monthID - 1] + ", " + year + ": " + bias_index;
}

function getBiasIndex(num_clusters, monthID, year) {
    var monthSimScore = 0;
    var biasScoreList = [];

    var y = document.getElementById("monthID").value;
    var currentMonth = parseInt(y);

    var x = document.getElementById("myText").value;
    var current_cluster = parseInt(x);

    var monthBias = bias_index;

    for (var i = 1; i < 13; i++) {
        try{
            var clusterPoints = geodesic_json[year][i][num_clusters]['points'];
        } catch (e){
            console.log(num_clusters);
            console.log(geodesic_json[year][i][num_clusters]);
            continue;
        }


        var geodesicClusterData = buildGeodesicClusterData(num_clusters);

        var data = fillGeodesicClusterData(num_clusters, geodesicClusterData, clusterPoints);
        var cluster_data = data[0];
        var euclidean_data = data[1];

        var euclid_cluster_count = 0;
        var sim_score = 0;
        var ratio = 1;

        var cluster_tracts = [];

        for (var j = 0; j < num_clusters; j++) {
            //calculate similarity score
            for (var k = 0; k < cluster_data.length; k++) {
                if (cluster_data[k]["clusters"][j]["count"] != 0) {
                    euclid_cluster_count += 1;
                    var cluster_ratio = cluster_data[k]["clusters"][j]["count"] / euclidean_data[j] * cluster_data[k]["clusters"][j]["count"] / cluster_data[k]["num_points"];
                    sim_score += cluster_ratio;
                }
            }

            /*

                Calculate minority ratio

             */
            var geoCluster = geodesic_json[year][i][num_clusters][j];
            //var demo_data = eval("geodesic_cluster_" + num_clusters + '_' + j);
            try{
                var cluster_vector = geoCluster['geometry']['coordinates'][0];
            } catch (e) {
                continue;
            }


            //loop through each tract
            for(var k=0; k<zipcodes['features'].length; k++) {
                var tract_vector = zipcodes['features'][k]['geometry']['coordinates'][0];
                var tract_num = zipcodes['features'][k]['properties']['TRACTCE10'];

                var partial_tract = [];
                //check if each point of the boundary of the tract is inside of the cluster
                for (var n = 0; n < tract_vector.length; n++) {
                    if (inside(tract_vector[n], cluster_vector)) {
                        partial_tract.push(tract_vector[n]);
                    }
                }
                partial_tract.push(partial_tract[0]);

                //get areas of the tracts found in the cluster
                var partial_area = calcPolygonArea(partial_tract);
                var full_area = calcPolygonArea(tract_vector);

                if (partial_area > 0 && full_area > 0) {
                    cluster_tracts.push({
                        'tract_num': tract_num,
                        'ratio': partial_area / full_area,
                        'White': zipcodes['features'][j]['properties']['White'] * partial_area / full_area,
                        'Black or African American': zipcodes['features'][j]['properties']['Black or African American'] * partial_area / full_area,
                        'American Indian and Ala Native': zipcodes['features'][j]['properties']['American Indian and Ala Native'] * partial_area / full_area,
                        'Native Hawaiian\/other Pac Isl': zipcodes['features'][j]['properties']['Native Hawaiian\/other Pac Isl'] * partial_area / full_area,
                        'Multiple Race': zipcodes['features'][j]['properties']['Multiple Race'] * partial_area / full_area,
                        'Asian': zipcodes['features'][j]['properties']['Asian'] * partial_area / full_area,
                        'Other Race': zipcodes['features'][j]['properties']['Other Race'] * partial_area / full_area
                    });
                }
            }
        }

        var total = 0;
        var minority = 0;
        var ratios = [];
        var labels = ['Black or African American', 'American Indian and Ala Native', 'Native Hawaiian\/other Pac Isl', 'Asian', 'Multiple Race', 'Other Race'];

        var stats = {};
        for(var s=0; s < labels.length; s++){
            stats[labels[s]] = 0;
        }

        for(var tract=0; tract<cluster_tracts.length; tract++){
            for(var l=0; l<labels.length; l++){
                stats[labels[l]] += Math.round(cluster_tracts[tract][labels[l]]);
                total += cluster_tracts[tract][labels[l]];
            }
            total += cluster_tracts[tract]['White'];
        }

        for(var c=0; c<labels.length; c++){
            //document.getElementById("demographic_stats").innerHTML += "Percent " + labels[i] + ": " + (stats[labels[i]]/total*100).toFixed(2) + "%<br />";
            minority += stats[labels[c]];
        }

        minority = (minority/total).toFixed(2);

        sim_score /= num_clusters;
        var bias_score = minority*(1-sim_score)

        if (i == currentMonth && num_clusters == current_cluster){
            bias_index = bias_score.toFixed(2);
        }
        biasScoreList.push(bias_score);
    }

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //document.getElementById('biasResult').innerHTML = "Bias Index For " + current_cluster + " Clusters in " + months[monthID - 1] + ", " + year + ": " + bias_index;

    return biasScoreList;
}

function buildGeodesicClusterData(num_clusters){
    var cluster_data = new Array(num_clusters);

	//initialize cluster data
    /*
           geodesic_cluster_data[cluster_number] = {number of euclidean clusters,
                                                     list of euclidean clusters:
                                                        {
                                                            cluster number,
                                                            count
                                                        }
                                                     number of points in cluster

         */
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

	return cluster_data;
}

function fillGeodesicClusterData(num_clusters, cluster_data, clusterPoints){
    //boolean for first run through euclid data
	var euclid_bool = true;
	var euclidean_data = new Array(num_clusters).fill(0);

	for(var i=0; i<clusterPoints['features'].length; i++){
	    var point = clusterPoints['features'][i];

	    var euclid_cluster = point['properties']['euclidean_cluster'];
        var geo_cluster = point['properties']['geodesic_cluster'];

        if(cluster_data[geo_cluster]['clusters'][euclid_cluster]['count'] == 0)
            cluster_data[geo_cluster]['num_clusters'] += 1;

        cluster_data[geo_cluster]['clusters'][euclid_cluster]['count'] += 1;
		cluster_data[geo_cluster]['num_points'] += 1;

        if(euclid_bool = true)
            euclidean_data[euclid_cluster] += 1;
    }

    return [cluster_data, euclidean_data];
}