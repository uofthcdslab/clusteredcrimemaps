# Clustered Crime Maps
This repository will contain all the maps and code for the algorithmic discrimination project. 
The results can be viewed at https://marquettecomputationalsocialscience.github.io/clusteredcrimemaps/

## Data  
All the data used for this project are publically available on the Milwaukee city website.
* The crime data are available at: http://itmdapps.milwaukee.gov/publicApplication_QD/queryDownload/login.faces
* The city shape files are available at: http://city.milwaukee.gov/DownloadMapData3497.htm#.WVL5eojyuUk

https://mygeodata.cloud and https://ogre.adc4gis.com/ were used to convert shape files to geoJSON


## Maps
The tools used to create maps are in the folders labeled "griffin" and "justin"

Griffin's maps are presented using D3 with python being used to cluster the data and store in a geoJSON frame.
* CrimeData folder contains the data sets used and the shapefiles
* newMap folder contains the javascript used to create the D3 maps

Justin's maps are presented usind leaflet library with python and the flask framework.
* maps directory has the shape files used to draw the maps
* sandbox contains standalone scrips from exploration and eperimentation
* crime_data contains the crime data sets plotted on the maps

