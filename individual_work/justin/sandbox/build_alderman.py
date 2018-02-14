import json

fn = open('../static/alderman.js', 'w')

#add alderman boundaries variable
json_file = open('../maps/alderman.geojson')
geo_json = json.load(json_file)
fn.write('var alderman_boundaries = ')
fn.write(json.dumps(geo_json))
fn.write(';\n\n')
json_file.close()