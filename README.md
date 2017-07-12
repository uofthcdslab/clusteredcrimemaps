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
* Earlier Prototypes
  * The Jupyter Notebooks used to create the first protoype map with Bokeh and process data are in the earlier_prototypes folder
  * CrimeData folder contains the original datasets and shapefiles, some of which may no longer be used
  * d3map folder contains the javascript used to create the original d3 cluster map for January 2015
* KMeans Folder
  * Contains the Juypter notebook files for clustering the full dataset and outputting it to a usable format
  * Contains the complete version of the crime map allowing for side-by-side clustering and demographic analysis
* Demographic Overlay
  * The Demographic data, shapefiles, and Juypter notebook used to process the data are present in Demograpic Overlay
* Data
  * The full data set is present in data_2015 and is processed and grouped with the Jupyter notebooks present
  * The raw data is present in 15 excel spreadsheets per month and the data is later grouped into one .csv per month
  * The Index folder contains an earlier version of the potential bias index calculation done with Python based on a pair-wise cluster comparison

Justin's maps are presented usind leaflet library with python and the flask framework.
* maps directory has the shape files used to draw the maps
* sandbox contains standalone scrips from exploration and eperimentation
* crime_data contains the crime data sets plotted on the maps

