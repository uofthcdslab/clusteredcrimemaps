import json
import csv
from datetime import datetime
from flask import Flask, render_template, request
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)

previous_data = []
prev_bool = False

colors = ['#ff7800', '#42a1f4', '#0ad81f', '#d80909', '#c407c4', 'yellow', 'black', 'white', 'brown']
color_idx = 0

crimes_selected = []
coordinate_array = []

def get_clusters(selected_crime):
    global coordinate_array

    with open('crime_data/Full_Dataset.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selected_crime:
                continue

            coordinate_array.append([row[10], row[11]])

    if len(coordinate_array) == 0:
        return None

    np_array = np.array(coordinate_array)
    kmeans = KMeans(n_clusters=9).fit(np_array)
    return kmeans

def get_coors(selected_crime):
    global color_idx
    global previous_data
    global prev_bool
    global colors

    coors = {
        "type": "FeatureCollection",
        "features": []
    }

    kmeans = get_clusters(selected_crime)

    with open('crime_data/Full_Dataset.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selected_crime:
                continue

            np_array = np.array([row[10], row[11]])
            np_array = np_array.reshape(1, -1)
            cluster = kmeans.predict(np_array)

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
                "fillColor": colors[int(cluster)],
                "popupContent": "District: " + row[12].strip('/crime_data/') + "\nCrime: " + selected_crime + '\n' + "Time occurred: " + row[1] + ' ' + row[2]
            },
            })

    if prev_bool == True:
        coors['features'] += previous_data
        previous_data += coors['features']
    else:
        previous_data = coors['features']

    return coors

@app.route('/')
def map():
    global color_idx
    global previous_data
    global prev_bool
    global crimes_selected
    global colors

    selected_crime = request.args.get('crime')
    preserve= request.args.get('preserve')

    if preserve == None:
        previous_data = []
        color_idx = 0
        crimes_selected = []
    else:
        prev_bool = True

    json_file = open('maps/alderman.geojson')
    geo_json = json.load(json_file)
    json_file.close()

    json_file = open('crime_data/crime_counts.json')
    crime_json = json.load(json_file)
    crime_list = list(crime_json.keys())

    crimes = get_coors(selected_crime)
    color_idx += 1

    crimes_selected.append(selected_crime)

    return render_template('index.html', crimes_selected=crimes_selected, colors=colors, crime_list=crime_list, crimes=crimes, districts=json.dumps(geo_json['features']))

if __name__ == '__main__':
    app.run()