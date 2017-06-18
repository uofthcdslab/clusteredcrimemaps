import os
import csv
import requests

full_csv = open('../crime_data/Full_Dataset.csv', 'w')

def get_long_lat(addr):
    response = requests.get(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' + addr + ',+Milwaukee,+WI')
    resp_json_payload = response.json()
    return resp_json_payload['results'][0]['geometry']['location']

def add_long_lat(fn):
    try:
        with open(fn) as csv_file:
            for row in csv.reader(csv_file, delimiter=','):
                if row[9] != '' and row[9] != 'LOCATION':
                    addr = row[9].replace(' ', '+')
                    print(addr)
                    loc = get_long_lat(addr)
                    row.append(str(loc['lat']))
                    row.append(str(loc['lng']))
                    row.append(fn.strip('.csv'))
                    full_csv.write(",".join(row) + '\n')
    except Exception as e:
        print(e)

#loop through each alderman district
for fn in os.listdir('../crime_data'):
    add_long_lat('../crime_data/' + fn)
full_csv.close()