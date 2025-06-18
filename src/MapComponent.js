// src/components/MapComponent.js

import React, { useEffect, useRef,useState } from 'react';
import maplibregl from 'maplibre-gl';
import proj4 from 'proj4'; // Import proj4
import 'maplibre-gl/dist/maplibre-gl.css';
import turf from 'turf'; 
import wellknown from 'wellknown'; 
import './MapComponent.css'; // Importa los estilos CSS desde un archivo separado


import {
  TerraDraw,
  TerraDrawMapLibreGLAdapter,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  ValidateNotSelfIntersecting,
  ValidateMinAreaSquareMeters,
} from 'terra-draw';

import Sidebar from './components/Sidebar';
import {loadLayersRaster,loadLayersVector} from './components/MapLayers';
import { convertWKTToGeoJSON, transformGeoJSON, transformCoordinates } from './utils/coordinateUtils';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [checked, setLayerBase] = useState(true);
  const polygonWKT = null; // Coloca aquí tu WKT si es necesario
  const proyecto = 'arboletes';//bello
  proj4.defs("EPSG:9377","+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
//const polygonWKT ='MULTIPOLYGON (((4891288.467 2103275.485, 4891288.161 2103274.76, 4891287.984 2103273.776, 4891287.772 2103272.511, 4891287.667 2103271.878, 4891287.49 2103270.998, 4891287.349 2103269.345, 4891287.102 2103267.939, 4891286.89 2103267.307, 4891286.644 2103266.709, 4891286.363 2103266.006, 4891286.081 2103265.127, 4891285.658 2103263.932, 4891285.306 2103262.842, 4891285.095 2103262.244, 4891284.813 2103261.119, 4891284.461 2103259.959, 4891284.214 2103259.221, 4891283.791 2103258.167, 4891283.439 2103257.639, 4891283.188 2103257.221, 4891283.017 2103256.936, 4891281.82 2103255.355, 4891281.223 2103254.475, 4891280.483 2103253.844, 4891280.061 2103253.562, 4891278.303 2103252.649, 4891277.916 2103252.403, 4891275.595 2103251.525, 4891274.013 2103251.21, 4891272.817 2103250.999, 4891270.989 2103250.86, 4891269.582 2103250.895, 4891268.07 2103250.58, 4891267.086 2103250.44, 4891265.433 2103250.37, 4891263.921 2103250.336, 4891261.283 2103250.021, 4891260.545 2103249.916, 4891259.244 2103249.6, 4891258.049 2103249.495, 4891257.054 2103249.266, 4891256.219 2103249.074, 4891255.376 2103248.688, 4891254.004 2103247.915, 4891253.336 2103247.389, 4891252.316 2103246.861, 4891252.098 2103246.735, 4891253.02 2103250.412, 4891252.951 2103251.15, 4891253.128 2103253.366, 4891253.163 2103254.526, 4891253.27 2103255.581, 4891253.446 2103257.234, 4891253.553 2103258.182, 4891253.799 2103259.273, 4891254.117 2103260.433, 4891254.257 2103261.417, 4891254.469 2103262.683, 4891254.61 2103263.527, 4891254.822 2103264.477, 4891255.069 2103265.707, 4891255.316 2103266.726, 4891255.491 2103267.499, 4891255.703 2103268.344, 4891256.125 2103269.714, 4891256.548 2103270.945, 4891259.028 2103275.89, 4891259.082 2103275.69, 4891259.152 2103275.48, 4891259.363 2103275.093, 4891259.468 2103274.916, 4891259.715 2103274.565, 4891259.996 2103273.896, 4891260.523 2103273.298, 4891260.944 2103272.841, 4891261.19 2103272.525, 4891261.507 2103272.103, 4891261.717 2103271.751, 4891262.878 2103272.559, 4891264.25 2103273.578, 4891265.376 2103274.526, 4891266.924 2103275.615, 4891267.944 2103276.423, 4891268.858 2103277.197, 4891269.878 2103278.005, 4891271.25 2103278.989, 4891272.129 2103279.586, 4891272.2 2103279.621, 4891273.361 2103280.359, 4891274.873 2103281.096, 4891276.209 2103281.729, 4891277.194 2103282.29, 4891278.671 2103283.029, 4891279.269 2103283.239, 4891280.324 2103283.765, 4891281.238 2103284.223, 4891283.109 2103285.056, 4891283.243 2103284.749, 4891283.98 2103283.025, 4891285.351 2103281.267, 4891286.405 2103279.543, 4891287.143 2103277.995, 4891287.669 2103276.554, 4891288.467 2103275.485)))';

  useEffect(() => {
    // Definir EPSG:9377
    // (Si es necesario, puedes mover esto a coordinateUtils.js)
    // ...

    // Inicializar el mapa
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://api.maptiler.com/maps/hybrid/style.json?key=auVrrAi8RvGIe5g64ifD', // Reemplaza con tu API key
      center: [-76.398179, 8.577703],//-75.558055555556, 6.3319444444444  , 
      zoom: 12,
    });

    // Agregar controles de navegación
    mapRef.current.addControl(new maplibregl.NavigationControl());
    mapRef.current.addControl(new maplibregl.FullscreenControl());

    // Inicializar modos de Terra Draw
    const polygonMode = new TerraDrawPolygonMode({
      snappingEnabled: true,
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
            draggable: false,
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
    });

    // Inicializar Terra Draw
    drawRef.current = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({
        map: mapRef.current,
        lib: maplibregl,
      }),
      modes: [selectMode, polygonMode],
    });
    const loadLayers= () => {
       // Agregar capas y fuentes
      loadLayersRaster(mapRef,proyecto);
      loadLayersVector(mapRef,proyecto);
      if (polygonWKT != null) {
        // Manejar la conversión de WKT y ajuste del mapa
        const geojsonWKT = convertWKTToGeoJSON(polygonWKT);
        geojsonWKT.coordinates = transformCoordinates(
          geojsonWKT.coordinates[0][0],
          'EPSG:9377',
          'WGS84'
        );
        const geo = {
          type: 'Feature',
          geometry: {
            coordinates: [geojsonWKT.coordinates],
            type: 'Polygon',
          },
        };

        mapRef.current.addSource('geojsonWKT', {
          type: 'geojson',
          data: geo,
        });

        mapRef.current.addLayer({
          id: 'geojsonWKT',
          type: 'fill',
          source: 'geojsonWKT',
          layout: {},
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.8,
          },
        });

        const bboxPolygon = turf.bbox(geo);
        mapRef.current.fitBounds(bboxPolygon, {
          padding: 20,
        });
      } else {
        drawRef.current.start();
        drawRef.current.setMode('polygon');
      }
    }
    
    /*mapRef.current.on('wheel', () => {
      loadLayers();
    })*/

    // Evento al cargar el mapa
    mapRef.current.on('load', () => {
      loadLayers();
    });

    

    // Evento al finalizar dibujo en Terra Draw
    drawRef.current.on('finish', (id, context) => {
      const action = context.action;
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
      if(state==true){
         mapRef.current.setLayoutProperty('osm', 'visibility', 'visible');
      }
      if(state==false){
        mapRef.current.setLayoutProperty('osm', 'visibility', 'none');
      }
    };
    window.OnChangeBase = OnChangeBase; // Exponer la función para poder ser usada en el DOM

    const OnChangeLayer = (target) => {
      if(target.checked==true){
        mapRef.current.setLayoutProperty(target.name, 'visibility', 'visible');
      }else{
        mapRef.current.setLayoutProperty(target.name, 'visibility', 'none');
      }
    };
    window.OnChangeLayer = OnChangeLayer; // Exponer la función para poder ser usada en el DOM
    // Limpiar al desmontar
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [polygonWKT]);

  // Funciones para cambiar modos y borrar geometrías
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
    const transformedGeoJSON = transformGeoJSON([geojson[0]], 'WGS84', 'EPSG:9377');
    let wkt = wellknown.stringify(transformedGeoJSON[0].geometry);
    wkt = wkt.replace('POLYGON ', 'MultiPolygon (');
    wkt = wkt + ')';
    console.log(wkt);
  };

  const layerBaseHandleChange = (event) => {
    setLayerBase(event.target.checked);
    window.OnChangeBase(event.target.checked);
  };

  const layerHandleChange = (event) => {
    const layerId = event.target.name;
    const visibility = event.target.checked ? 'visible' : 'none';
    mapRef.current.setLayoutProperty(layerId, 'visibility', visibility);
  };

  return (
    <div>
      {/* Contenedor del Mapa */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div ref={mapContainerRef} style={{ width: '90%', height: '80vh', position: 'relative' }}>
          {/* Componente Sidebar */}
          <Sidebar
            checked={checked}
            layerBaseHandleChange={layerBaseHandleChange}
            layerHandleChange={layerHandleChange}
          />
        </div>
      </div>

      {/* Botones */}
      {polygonWKT == null && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <button onClick={switchToPolygonMode}>Dibujar Polígono</button>
          <button onClick={switchToSelectMode}>Seleccionar</button>
          <button onClick={deleteAllGeometries}>Borrar Todo</button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
