# clusteredcrimemaps
This repository will contain all the maps and code for the algorithmic discrimination project.

**June 13:** Have 1st exemplars of interactive crime maps up.

--Theft Maps--
Data Conversion and Formatting notebook takes the spreadsheets and converts them into a single pandas document
which can then be saved as a csv file to be used later. It also handles the geocoding of the addresses.

Theft Map notebook displays a rudimentary version of the map, which still needs some heavy editing.

The map can be viewed from theftmap.html and the notebooks only need to be used if one wishes to alter elements of the map.

--CrimeData--:
Folder contains the spreadsheets for the 15 aldermanic districts as well as several publically avaiable shape files
that were used at various stages of map drawing.

##Framework##
-Based on Flask framework found in app.py
-Sandbox dir contains various standalone scripts for exploring/experimenting
-Maps dir has all map data, my app works with alderman.geojson
-crime_data dir holds Milwaukee crime dataset
    -- crime_data/Full_Dataset.csv is the full dataset with latitude and longitude
    
##Map##
-Using leaflet.js library to build interactive map
-Super easy to plug in geojson data and build up visuals quickly

##DATA##
- http://itmdapps.milwaukee.gov/publicApplication_QD/queryDownload/login.faces
-I used https://mygeodata.cloud to convert GIS files into geoJSON

Run 'python3 app.py'
Go to localhost:5000


##WEBSITE##
Link: https://marquettecomputationalsocialscience.github.io/clusteredcrimemaps/