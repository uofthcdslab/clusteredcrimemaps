from kmeans import kmeans, predict
import numpy as np
import csv
from osgeo import ogr
import json
import sys
from scipy.spatial import ConvexHull

def get_clusters(selectedCrime, month, year, type, num_clusters):
    coordinate_array = []
    data_array = []
    with open('../crime_data/yearly_data/' + selectedCrime + '/latlng/' + str(year) + '_full.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selectedCrime or row[10] != str(month):
                continue

            coordinate_array.append([float(row[11]), float(row[12])])
            data_array.append(row)

    KMeans = kmeans(points=coordinate_array, k=num_clusters, type=type)
    return KMeans, coordinate_array, data_array


def build_cluster_data(pointList, selected_crime, cluster):
    ring = ogr.Geometry(ogr.wkbLinearRing)
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
            "cluster": cluster,
            "style": {
                "weight": 3,
                "color": "black",
                "opacity": 1,
                "fillColor": "#0ad81f",
                "fillOpacity": 0
            }
        },
        "geometry": geo
    }

    return data

def process(selectedCrime, type):
    colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'cyan', 'brown']

    finalData = {}
    for year in range(2005, 2017):
        print (year)
        finalData[str(year)] = {}
        for month in range(1,13):
            print('    ' + str(month))
            finalData[str(year)][str(month)] = {}

            for num_clusters in range(2,11):
                print('        ' + str(num_clusters))
                points = {
                    "type": "FeatureCollection",
                    "features": []
                }

                finalData[str(year)][str(month)][str(num_clusters)] = {}
                clusterData = [[] for Null in range(num_clusters)]

                geodesic_clusters, coordinate_array, data_array = get_clusters(selectedCrime=selectedCrime, type='geodesic', month=month, year=year, num_clusters=num_clusters)
                euclidean_clusters, co, da = get_clusters(selectedCrime=selectedCrime, type='euclidean', month=month, year=year, num_clusters=num_clusters)
                for coor in coordinate_array:
                    c_geodesic = predict(num_clusters, geodesic_clusters, [float(coor[0]), float(coor[1])], type='geodesic')
                    c_euclidean = predict(num_clusters, euclidean_clusters, [float(coor[0]), float(coor[1])], type='euclidean')
                    clusterData[int(c_geodesic)].append([float(coor[1]), float(coor[0])])
                    points["features"].append({
            "geometry": {
                "type": "Point",
                "coordinates": [
                    float(coor[1]),
                    float(coor[0])
                ]
            },
            "type": "Feature",
            "properties": {
                "fillColor": colors[c_euclidean],
                "euclidean_cluster": c_euclidean,
                "geodesic_cluster": c_geodesic,
                "popupContent": ""},
            })

                finalData[str(year)][str(month)][str(num_clusters)]['points'] = points

                for i in range(0, num_clusters):
                    try:
                        finalData[str(year)][str(month)][str(num_clusters)][str(i)] = build_cluster_data(clusterData[i], selected_crime=selectedCrime, cluster=i)
                    except:
                        try:
                            finalData[str(year)][str(month)][str(num_clusters)][str(i)] = build_cluster_data(
                                clusterData[i], selected_crime=selectedCrime, cluster=i)
                        except:
                            print('continuing')
                            continue

    fn = open('../static/' + selectedCrime + '/' + type + '_final_points.js', 'w')
    fn.write('var geodesic_data = ')
    fn.write(json.dumps(finalData))
    fn.write(';\n')
    fn.close()

process('SIMPLE ASSAULT', 'geodesic')