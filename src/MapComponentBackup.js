import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import proj4 from 'proj4'; // Import proj4
import 'maplibre-gl/dist/maplibre-gl.css';

import turf from 'turf'; 
import wellknown from 'wellknown'; 

import './MapComponent.css'; // Importa los estilos CSS desde un archivo separado
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

import Paper from '@mui/material/Paper';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Divider from '@mui/material/Divider';


import {
  TerraDraw,
  TerraDrawMapLibreGLAdapter,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  ValidateNotSelfIntersecting,
  ValidateMinAreaSquareMeters,
} from 'terra-draw';

// Define EPSG:9377
proj4.defs("EPSG:9377","+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
//const polygonWKT ='MultiPolygon (((836260.4256369784 1192395.6043061689, 836271.4349366564 1192414.9267503768, 836277.2437204994 1192401.230421805, 836280.4375121228 1192388.3335129383, 836276.7423941055 1192387.274193129, 836271.4559568523 1192390.038182759, 836260.4256369784 1192395.6043061689)))';
//const polygonWKT ='MULTIPOLYGON (((4891288.467 2103275.485, 4891288.161 2103274.76, 4891287.984 2103273.776, 4891287.772 2103272.511, 4891287.667 2103271.878, 4891287.49 2103270.998, 4891287.349 2103269.345, 4891287.102 2103267.939, 4891286.89 2103267.307, 4891286.644 2103266.709, 4891286.363 2103266.006, 4891286.081 2103265.127, 4891285.658 2103263.932, 4891285.306 2103262.842, 4891285.095 2103262.244, 4891284.813 2103261.119, 4891284.461 2103259.959, 4891284.214 2103259.221, 4891283.791 2103258.167, 4891283.439 2103257.639, 4891283.188 2103257.221, 4891283.017 2103256.936, 4891281.82 2103255.355, 4891281.223 2103254.475, 4891280.483 2103253.844, 4891280.061 2103253.562, 4891278.303 2103252.649, 4891277.916 2103252.403, 4891275.595 2103251.525, 4891274.013 2103251.21, 4891272.817 2103250.999, 4891270.989 2103250.86, 4891269.582 2103250.895, 4891268.07 2103250.58, 4891267.086 2103250.44, 4891265.433 2103250.37, 4891263.921 2103250.336, 4891261.283 2103250.021, 4891260.545 2103249.916, 4891259.244 2103249.6, 4891258.049 2103249.495, 4891257.054 2103249.266, 4891256.219 2103249.074, 4891255.376 2103248.688, 4891254.004 2103247.915, 4891253.336 2103247.389, 4891252.316 2103246.861, 4891252.098 2103246.735, 4891253.02 2103250.412, 4891252.951 2103251.15, 4891253.128 2103253.366, 4891253.163 2103254.526, 4891253.27 2103255.581, 4891253.446 2103257.234, 4891253.553 2103258.182, 4891253.799 2103259.273, 4891254.117 2103260.433, 4891254.257 2103261.417, 4891254.469 2103262.683, 4891254.61 2103263.527, 4891254.822 2103264.477, 4891255.069 2103265.707, 4891255.316 2103266.726, 4891255.491 2103267.499, 4891255.703 2103268.344, 4891256.125 2103269.714, 4891256.548 2103270.945, 4891259.028 2103275.89, 4891259.082 2103275.69, 4891259.152 2103275.48, 4891259.363 2103275.093, 4891259.468 2103274.916, 4891259.715 2103274.565, 4891259.996 2103273.896, 4891260.523 2103273.298, 4891260.944 2103272.841, 4891261.19 2103272.525, 4891261.507 2103272.103, 4891261.717 2103271.751, 4891262.878 2103272.559, 4891264.25 2103273.578, 4891265.376 2103274.526, 4891266.924 2103275.615, 4891267.944 2103276.423, 4891268.858 2103277.197, 4891269.878 2103278.005, 4891271.25 2103278.989, 4891272.129 2103279.586, 4891272.2 2103279.621, 4891273.361 2103280.359, 4891274.873 2103281.096, 4891276.209 2103281.729, 4891277.194 2103282.29, 4891278.671 2103283.029, 4891279.269 2103283.239, 4891280.324 2103283.765, 4891281.238 2103284.223, 4891283.109 2103285.056, 4891283.243 2103284.749, 4891283.98 2103283.025, 4891285.351 2103281.267, 4891286.405 2103279.543, 4891287.143 2103277.995, 4891287.669 2103276.554, 4891288.467 2103275.485)))';

const polygonWKT =null;
const MapComponent = () => {
  const mapContainerRef = useRef(null); // Reference to the map container div
  const mapRef = useRef(null); // Reference to the MapLibre GL map instance
  const drawRef = useRef(null); // Reference to the Terra Draw instance

  const [checked, setlayerBase] = React.useState(true);
 
  
  useEffect(() => {
    // Initialize the MapLibre GL map with a blank style
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style:'https://api.maptiler.com/maps/streets/style.json?key=auVrrAi8RvGIe5g64ifD',
      center: [-75.558055555556, 6.3319444444444],
      zoom: 12,
    });
     // Agrega el control de navegación aquí
    mapRef.current.addControl(new maplibregl.NavigationControl());
    mapRef.current.addControl(new maplibregl.FullscreenControl());

    // Initialize the modes
    const polygonMode = new TerraDrawPolygonMode({
      snappingEnabled :true,
      validation: (feature, { updateType }) => {
        if (updateType === 'finish' || updateType === 'commit') {
          return ValidateNotSelfIntersecting(feature);
        }
        return true;
      },
    });

    const selectMode = new TerraDrawSelectMode({
      allowManualDeselection: true,
      flags: {
        polygon: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
              resizeable: 'center',
              validation: (feature, context) => {
                return (
                  feature.geometry.type !== 'Polygon' &&
                  ValidateMinAreaSquareMeters(feature.geometry, 100)
                );
              },
            },
          },
        },
      },
      styles: {
        // See Styling Guide for more information
      },
    });

    // Initialize Terra Draw
    drawRef.current = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({
        map: mapRef.current,
        lib: maplibregl,
      }),
      modes: [selectMode, polygonMode],
    });
    
    // Start Terra Draw when the map is loaded
    mapRef.current.on('load', () => {
              
      mapRef.current.addLayer({
        'id': 'cca_ortofoto_cog',
         'type': 'raster',
         'source': {
            'type': 'raster',
              'tiles': [
                'http://coplanin.com.co/geoserver/bello/wms?SERVICE=WMS&VERSION=1.1.1&'+
                'REQUEST=GetMap&FORMAT=image%2Fpng&'+
                'TRANSPARENT=true&STYLES&'+
                'LAYERS=bello:cca_ortofoto_cog&'+
                'WIDTH=256'+
                '&HEIGHT=256'+
                '&SRS=EPSG%3A3857'+
                '&exceptions=application/vnd.ogc.se_blank'+
                '&tiled=false '+
                '&bbox={bbox-epsg-3857}'
              ],
              'tileSize': 256
         }
      });
      mapRef.current.setLayoutProperty('cca_ortofoto_cog', 'visibility', 'visible');


      mapRef.current.addSource('cca_terreno', {
        "type": "vector",
        "tiles": [
          "http://coplanin.com.co/geoserver/gwc/service/wmts?REQUEST=GetTile" +
            "&SERVICE=WMTS&VERSION=1.0.0&LAYER=bello:cca_terreno&STYLE=" +
            "&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913" +
            '&exceptions=application/vnd.ogc.se_blank'+
            "&FORMAT=application/vnd.mapbox-vector-tile" +
             "&TILECOL={x}&TILEROW={y}"
        ]
      });


      mapRef.current.addLayer({
          'id': 'cca_terreno',
          'type': 'line',
          'source': 'cca_terreno',
          'source-layer': 'cca_terreno',
           'paint': {
                'line-color': 'red',
                'line-width': 2
          }
      });
      mapRef.current.setLayoutProperty('cca_terreno', 'visibility', 'visible');
      

      mapRef.current.addSource('cca_unidadconstruccion', {
        "type": "vector",
        "tiles": [
          "http://coplanin.com.co/geoserver/gwc/service/wmts?REQUEST=GetTile" +
            "&SERVICE=WMTS&VERSION=1.0.0&LAYER=bello:cca_unidadconstruccion&STYLE=" +
            "&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913" +
            '&exceptions=application/vnd.ogc.se_blank'+
            "&FORMAT=application/vnd.mapbox-vector-tile" +
             "&TILECOL={x}&TILEROW={y}"
        ]
      });


      mapRef.current.addLayer({
          'id': 'cca_unidadconstruccion',
          'type': 'fill',
          'source': 'cca_unidadconstruccion',
          'source-layer': 'cca_unidadconstruccion',
           'paint': {
            "fill-opacity": 0.7,
            "fill-color": "grey",
            "fill-outline-color": "black",
          }
      });
      mapRef.current.setLayoutProperty('cca_unidadconstruccion', 'visibility', 'visible');


      mapRef.current.addSource('street', {
        type: 'raster',
        tiles: [
          'https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
      });

      mapRef.current.addLayer({
        id: 'street',
        type: 'raster',
        source: 'street',
      });
      
      if(polygonWKT!=null){
        
        let geojsonwtk = convertWKTToGeoJSON(polygonWKT);
        geojsonwtk.coordinates=transformCoordinates(geojsonwtk.coordinates[0][0], 'EPSG:9377', 'WGS84');
        let geo={
          type: "Feature",
          geometry: {
            coordinates: [geojsonwtk.coordinates],
            type:"Polygon"
          }
        };

        //const geo = transformGeoJSON(geojsonwtk, 'EPSG:9377', 'WGS84');
        console.log(geo)
        mapRef.current.addSource('geojsonwtk', {
          'type': 'geojson',
          'data':geo});
        
        mapRef.current.addLayer({
          'id': 'geojsonwtk',
          'type': 'fill',
          'source': 'geojsonwtk',
          'layout': {},
          'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.8
          }
        });
        
        var bboxPolygon = turf.bbox(geo);
        console.log(bboxPolygon);
        mapRef.current.fitBounds(bboxPolygon, {
            padding: 20
        });
        
      }else{
        drawRef.current.start();
        drawRef.current.setMode('polygon');
      }
    });

  

    toggleSidebar('left');
    drawRef.current.on("finish", (id, context) => {
      let action=context.action
      console.log(context)
      if (action === 'draw') {
        drawRef.current.setMode('static');
      } 
      getGeoJSONData();  
    });

    
    const toggleSidebar = (id) => {
      const elem = document.getElementById(id);
      const collapsed = elem.classList.toggle('collapsed');
      const padding = {};
      padding[id] = collapsed ? 0 : 300;

      mapRef.current.easeTo({
        padding: padding,
        duration: 1000,
      });
    };

    window.toggleSidebar = toggleSidebar; // Exponer la función para poder ser usada en el DOM


    const OnChangeBase = (state) => {
      console.log("uu")
      if(state==true){
        mapRef.current.setStyle('https://api.maptiler.com/maps/streets/style.json?key=auVrrAi8RvGIe5g64ifD')
      }
      if(state==false){
        mapRef.current.setStyle('https://api.maptiler.com/maps/hybrid/style.json?key=auVrrAi8RvGIe5g64ifD')
      }
      
    };
    window.OnChangeBase = OnChangeBase; // Exponer la función para poder ser usada en el DOM

    const OnChangeLayer = (target) => {
      console.log(target.checked)
      if(target.checked==true){
        mapRef.current.setLayoutProperty(target.name, 'visibility', 'visible');
      }else{
        mapRef.current.setLayoutProperty(target.name, 'visibility', 'none');
      }
      
      
    };
    window.OnChangeLayer = OnChangeLayer; // Exponer la función para poder ser usada en el DOM
    
   

    // Clean up on unmount
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  },[]);

  // Functions to switch modes and delete geometries
  const convertWKTToGeoJSON = (wkt)=> {
    try {
      // Convierte el WKT a un objeto GeoJSON
      const geojson = wellknown.parse(wkt);
      return geojson;
    } catch (error) {
      console.error("Error converting WKT to GeoJSON:", error);
      return null;
    }
  }

  // Functions to switch modes and delete geometries
  const switchToPolygonMode = () => {
    drawRef.current.clear();
    drawRef.current.setMode('polygon');
  };

  const switchToSelectMode = () => {
    drawRef.current.setMode('select');
  };

  const deleteAllGeometries = () => {
    drawRef.current.clear();
    drawRef.current.setMode('polygon');
  };


  
  const getGeoJSONData = () => {
    const geojson = drawRef.current.getSnapshot();
    console.log(geojson)
    // Transform coordinates from EPSG:4326 to EPSG:9377
    const transformedGeoJSON = transformGeoJSON([geojson[0]], 'WGS84', 'EPSG:9377');
    //let wtk=getWTK(transformedGeoJSON);
    
    // Convert GeoJSON geometry to WKT
    let wkt = wellknown.stringify(transformedGeoJSON[0].geometry);
    wkt=wkt.replace('POLYGON ','MultiPolygon (')
    wkt=wkt+')';
    console.log(wkt);
  };

  const transformCoordinates = (coords,fromProj, toProj) => {
    let coorsnew=[];
    
    for (let i = 0; i < coords.length; i++) {
      coorsnew.push(proj4(fromProj, toProj, coords[i]))
    } 
    return coorsnew ;
  };

  // Function to transform GeoJSON coordinates
  const transformGeoJSON = (geojson, fromProj, toProj) => {
        // Create a deep copy of the GeoJSON to avoid mutating the original data
    const transformedGeoJSON = JSON.parse(JSON.stringify(geojson));
    // Function to recursively transform coordinates
   
    console.log(transformedGeoJSON);
    transformedGeoJSON.features = transformedGeoJSON.map((feature) => {
      
      feature.geometry.coordinates[0] = transformCoordinates(
        feature.geometry.coordinates[0],fromProj, toProj
      );
      return feature;
    });
    return transformedGeoJSON;
  };

  const layerBaseHandleChange = (event) => {
    
    console.log(event)
    window.OnChangeBase(event.target.checked);
    setlayerBase(event.target.checked);
  };

  
  const layerHandleChange = (event) => {
    console.log(event.target);
    window.OnChangeLayer(event.target)
  };

  if(polygonWKT==null){

    return (
      <div>
        {/* Contenedor del Mapa */}
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div ref={mapContainerRef} style={{ width: '70%', height: '70vh', position: 'relative' }}>
            <div id="left" className="sidebar flex-center left collapsed">
              
              <div className="sidebar-guion flex-center">
                <div className="sidebar-toggle rounded-rect left" onClick={() => window.toggleSidebar('left')}>
                  &rarr;
                </div>
              </div>
              <div className="sidebar-content rounded-rect" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
              <Paper elevation={3}  style={{ width: '80%', height: '80%', position: 'relative' }}>
                <fieldset className="select-fieldset selectFieldsetStyle">
                  <Box sx={{ minWidth: 120 }}>
                      <Switch
                        checked={checked}
                        onChange={layerBaseHandleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      <Divider>.</Divider>
                      <FormGroup >
                        <FormControlLabel 
                        size="small" 
                        name="cca_unidadconstruccion"
                        control={<Checkbox defaultChecked />} 
                        label="U Construcción"
                        onChange={layerHandleChange} 
                        />
                        <FormControlLabel 
                        size="small" 
                        name="cca_terreno"
                        control={<Checkbox defaultChecked />} 
                        label="Terreno"                         
                        onChange={layerHandleChange} />
                         <FormControlLabel 
                        size="small" 
                        name="cca_ortofoto_cog"
                        control={<Checkbox defaultChecked />} 
                        label="Ortofoto"                         
                        onChange={layerHandleChange} />
                      </FormGroup>
                    </Box>
                  </fieldset>                
                </Paper>
              </div>
            </div>
           </div>
        </div>
        
        {/* Formulario y Botones */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <button onClick={switchToPolygonMode}>Dibujar Polígono</button>
          <button onClick={switchToSelectMode}>Seleccionar</button>
          <button onClick={deleteAllGeometries}>Borrar Todo</button>
        </div>
      </div>
    );
    
    }else{
      return (
        
        <div>
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div ref={mapContainerRef} style={{ width: '70%', height: '70vh' }} />
          </div>
        </div>
      );
    }
};

export default MapComponent;
