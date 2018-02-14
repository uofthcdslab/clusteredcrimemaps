import csv
import json

selected_crime = 'ROBBERY'
cluster = 3
alogrithm = 'geodesic'

colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'cyan', 'brown']

def get_coors():
    coors = {
        "type": "FeatureCollection",
        "features": []
    }

    with open('../crime_data/' + alogrithm + '/' + selected_crime + '/' + selected_crime + '_CLUSTER_' + str(cluster) + '.csv') as csv_file:
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
                "fillColor": colors[int(row[13])],
                "cluster": int(row[13]),
                "popupContent": "District: " + row[12].strip('/crime_data/') + "\nCrime: " + selected_crime + '\n' + "Time occurred: " + row[1] + ' ' + row[2]
            },
            })

    return coors

def write_data():
    #add points
    crimes = get_coors()
    fn.write('var crimes_' + alogrithm + '_' + str(cluster) + ' = ')
    fn.write(json.dumps(crimes))
    fn.write(';\n\n')

fn = open('../static/crimes-' + alogrithm + '.js', 'w')
for i in range(2,11):
    cluster = i
    write_data()

fn.close()