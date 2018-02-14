import os
import json

counts = {
    'white': 0,
    'black': 0,
    'native': 0,
    'asian': 0,
    'pacific': 0,
    'multiple': 0,
    'other': 0,
    'total': 0
}

tract_fn = open('../static/tract_data.js', 'w')

for fn in os.listdir('../maps/milwaukee_tracts'):
     tract_counts = {
    'white': 0,
    'black': 0,
    'native': 0,
    'asian': 0,
    'pacific': 0,
    'multiple': 0,
    'other': 0,
    'total': 0
}
     print(tract_counts)
     with open('../maps/milwaukee_tracts/' + fn, 'r') as tract:
         firstline = tract.readline().split(',')

         for line in tract:
            line = line.split(',')
            if line[0] == '':
                break

            try:
                int(line[1])
            except:
                break

            #print(line)
            tract_counts['white'] += int(line[1])
            tract_counts['black'] += int(line[2])
            tract_counts['native'] += int(line[3])
            tract_counts['asian'] += int(line[4])
            tract_counts['pacific'] += int(line[5])
            tract_counts['multiple'] += int(line[6])
            tract_counts['other'] += int(line[7])
            tract_counts['total'] += int(line[8])

         tract_fn.write('var tract_' + fn.strip('.csv') + ' = ' + json.dumps(tract_counts) + ';\n')

tract_fn.close()