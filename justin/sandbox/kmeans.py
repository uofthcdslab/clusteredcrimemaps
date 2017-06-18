from sklearn.cluster import KMeans
import numpy as np
import csv

coordinate_array = []

def get_clusters(selected_crime):
    global coordinate_array

    with open('../crime_data/Full_Dataset.csv') as csv_file:
        for row in csv.reader(csv_file, delimiter=','):
            if row[4] != selected_crime:
                continue

            coordinate_array.append([row[10], row[11]])

    np_array = np.array(coordinate_array)
    kmeans = KMeans(n_clusters=4).fit(np_array)
    return kmeans

selected_crime = 'ROBBERY'
clusters = get_clusters(selected_crime)

for row in coordinate_array:
    np_array = np.array([row[0], row[1]])
    np_array = np_array.reshape(1, -1)
    print("Latitiude: {0}   Longitude: {1}  Cluster:{2}".format(row[0],row[1],clusters.predict(np_array)))