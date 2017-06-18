import csv
import os
import json

crimes = {}

def find_popularity(fn):
    try:
        with open(fn) as csv_file:
            for row in csv.reader(csv_file, delimiter=','):
                if row[4] != '':
                    if row[4] in crimes:
                        crimes[row[4]] += 1
                    else:
                        crimes[row[4]] = 0
                elif row[5] != '':
                    if row[5] in crimes:
                        crimes[row[5]] += 1
                    else:
                        crimes[row[5]] = 0
                elif row[6] != '':
                    if row[6] in crimes:
                        crimes[row[6]] += 1
                    else:
                        crimes[row[6]] = 0

    except Exception as e:
        print(e)

#loop through each alderman district
for fn in os.listdir('../crime_data'):
    print(fn)
    find_popularity('../crime_data/' + fn)

print(json.dumps(crimes, indent=1))