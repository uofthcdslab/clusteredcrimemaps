from sklearn.cluster import KMeans
import numpy as np
import csv
from osgeo import ogr
import json
import sys
from scipy.spatial import ConvexHull

coordinate_array = []
data_array = []
num_clusters = 2
selected_crime = 'SIMPLE ASSAULT'

def get_clusters(selected_crime):
    global coordinate_array
    global num_clusters
    global data_array

    with open('../crime_data/Full_' + selected_crime + '.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selected_crime:
                continue

            coordinate_array.append([row[10], row[11]])
            data_array.append(row)

    np_array = np.array(coordinate_array)
    kmeans = KMeans(n_clusters=num_clusters, init='random').fit(np_array)
    return kmeans

def add_data():
    global coordinate_array
    global data_array
    global num_clusters
    global selected_crime

    clusters = get_clusters(selected_crime)

    fn = open('../crime_data/' + selected_crime + '/' + selected_crime + '_CLUSTER_' + str(num_clusters) + '.csv', 'w')
    for coor, data in zip(coordinate_array, data_array):

        np_array = np.array([float(coor[0]), float(coor[1])])
        np_array = np_array.reshape(1, -1)
        c = clusters.predict(np_array)

        data.append(str(c[0]))
        data.append('\n')
        fn.write(",".join(data))
        print("Latitiude: {0}   Longitude: {1}  Cluster:{2}".format(coor[0],coor[1],c[0]))

    fn.close()

def get_coors():
    global selected_crime

    coors = {
        "type": "FeatureCollection",
        "features": []
    }

    with open('../crime_data/Full_Dataset.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selected_crime:
                continue

            coors['features'].append({
            "geometry": {
                "type": "Point",
                "coordinates": [
                    float(row[11]),
                    float(row[10])
                ]
            },
            "type": "Feature",
            "properties": {
                "fillColor": 'white',
                "popupContent": "District: " + row[12].strip('/crime_data/') + "\nCrime: " + selected_crime + '\n' + "Time occurred: " + row[1] + ' ' + row[2]
            },
            })

    return coors

def build_js(cluster):
    global selected_crime
    global num_clusters

    ring = ogr.Geometry(ogr.wkbLinearRing)
    pointList = []

    with open('../crime_data/' + selected_crime + '/' + selected_crime + '_CLUSTER_' + str(num_clusters) + '.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selected_crime or row[13] != str(cluster):
                continue

            lat = row[11]
            lon = row[10]
            #ring.AddPoint(float(lat), float(lon))
            pointList.append([float(lat), float(lon)])

    cv = ConvexHull(pointList)
    hullPoints = cv.vertices

    for i in hullPoints:
        ring.AddPoint(pointList[i][0], pointList[i][1])

    # Add the ring to the polygon
    poly = ogr.Geometry(ogr.wkbPolygon)
    poly.AddGeometry(ring)
    geometry = poly.ExportToJson()

    geo = json.loads(geometry)
    coors = []

    for i in geo['coordinates'][0]:
        i.pop(2)
        coors.append(i)

    geo['coordinates'][0] = coors

    data = {
        "type": "Feature",
        "properties": {
            "popupContent": "This is cluster " + str(cluster) + ' for ' + selected_crime,
            "style": {
                "weight": 2,
                "color": "#ff7800",
                "opacity": 1,
                "fillColor": "#0ad81f",
                "fillOpacity": 0.8
            }
        },
        "geometry": geo
    }

    #print(json.dumps(data, indent=1))

    return json.dumps(data, indent=1)

#build csv files for each cluster
'''for c in range(2,11):
    data_array = []
    coordinate_array = []
    num_clusters = c
    add_data()
exit()'''

num_clusters = int(sys.argv[1])
print('Number of clusters: ' + str(num_clusters))

#create javascript geoJSON file for each cluster
fn = open('../static/' + selected_crime + '_CLUSTERS_' + str(num_clusters) + '.js', 'w')

for i in range(0,num_clusters):
    new_var = build_js(i)
    fn.write(' var cluster_' + str(num_clusters) + '_' + str(i) + ' = ')
    fn.write(new_var)
    fn.write(';\n\n')

#add alderman boundaries variable
json_file = open('../maps/alderman.geojson')
geo_json = json.load(json_file)
fn.write('var alderman_' + str(num_clusters) + ' = ')
fn.write(json.dumps(geo_json))
fn.write(';\n\n')
json_file.close()

#add points
crimes = get_coors()
fn.write('var crimes_' + str(num_clusters) + ' = ')
fn.write(json.dumps(crimes))
fn.write(';\n\n')

fn.close()