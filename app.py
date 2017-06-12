import json
import csv
from datetime import datetime
from flask import Flask, render_template, request
app = Flask(__name__)

previous_data = []
prev_bool = False

colors = ['#ff7800', '#42a1f4', '#0ad81f', '#d80909', '#c407c4']
color_idx = 0

crimes_selected = []

def get_coors(selected_crime):
    global color_idx
    global previous_data
    global prev_bool
    global colors

    coors = {
        "type": "FeatureCollection",
        "features": []
    }

    with open('crime_data/Full_Dataset.csv') as csv_file:
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
                "fillColor": colors[color_idx],
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