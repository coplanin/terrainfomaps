// src/components/MapComponent.js

import React, { useEffect, useRef,useState } from 'react';
import maplibregl from 'maplibre-gl';
import proj4 from 'proj4'; // Import proj4
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from 'turf';
import { getCoords } from "@turf/invariant";
import wellknown from 'wellknown'; 
import './MapComponent.css'; // Importa los estilos CSS desde un archivo separado


import {
  TerraDraw,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  ValidateNotSelfIntersecting,
  // Removed ValidateMinAreaSquareMeters as it's unused
} from 'terra-draw';

import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

import Sidebar from './components/Sidebar';
import {loadLayersRaster,loadLayersVector,loadGeom} from './components/MapLayers';
import { convertWKTToGeoJSON, transformGeoJSON, transformCoordinates } from './utils/coordinateUtils';


// Extend the Window interface
declare global {
  interface Window {
    OnChangeBase: (state: boolean) => void;
    OnChangeLayer: (target: { checked: boolean; name: string }) => void;
  }
}

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  // Define types for refs
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);
  const [checked, setLayerBase] = useState(true);
  const proyecto = 'zambrano';//'san_juan_uraba'!'san_pedro_uraba'|'necocli'|'arboletes'|'bello';
  const center:[number,number]= [-74.878387,9.743468];//[-76.526727,8.708125]|[-76.325652,8.357172]|[ -76.673764 ,8.488191]|[ -76.418710,8.609346]|[-75.558055555556, 6.3319444444444];
  proj4.defs("EPSG:9377","+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
  const polygonWKT = null; // Coloca aquí tu WKT si es necesario
  //const polygonWKT ='MULTIPOLYGON (((4891288.467 2103275.485, 4891288.161 2103274.76, 4891287.984 2103273.776, 4891287.772 2103272.511, 4891287.667 2103271.878, 4891287.49 2103270.998, 4891287.349 2103269.345, 4891287.102 2103267.939, 4891286.89 2103267.307, 4891286.644 2103266.709, 4891286.363 2103266.006, 4891286.081 2103265.127, 4891285.658 2103263.932, 4891285.306 2103262.842, 4891285.095 2103262.244, 4891284.813 2103261.119, 4891284.461 2103259.959, 4891284.214 2103259.221, 4891283.791 2103258.167, 4891283.439 2103257.639, 4891283.188 2103257.221, 4891283.017 2103256.936, 4891281.82 2103255.355, 4891281.223 2103254.475, 4891280.483 2103253.844, 4891280.061 2103253.562, 4891278.303 2103252.649, 4891277.916 2103252.403, 4891275.595 2103251.525, 4891274.013 2103251.21, 4891272.817 2103250.999, 4891270.989 2103250.86, 4891269.582 2103250.895, 4891268.07 2103250.58, 4891267.086 2103250.44, 4891265.433 2103250.37, 4891263.921 2103250.336, 4891261.283 2103250.021, 4891260.545 2103249.916, 4891259.244 2103249.6, 4891258.049 2103249.495, 4891257.054 2103249.266, 4891256.219 2103249.074, 4891255.376 2103248.688, 4891254.004 2103247.915, 4891253.336 2103247.389, 4891252.316 2103246.861, 4891252.098 2103246.735, 4891253.02 2103250.412, 4891252.951 2103251.15, 4891253.128 2103253.366, 4891253.163 2103254.526, 4891253.27 2103255.581, 4891253.446 2103257.234, 4891253.553 2103258.182, 4891253.799 2103259.273, 4891254.117 2103260.433, 4891254.257 2103261.417, 4891254.469 2103262.683, 4891254.61 2103263.527, 4891254.822 2103264.477, 4891255.069 2103265.707, 4891255.316 2103266.726, 4891255.491 2103267.499, 4891255.703 2103268.344, 4891256.125 2103269.714, 4891256.548 2103270.945, 4891259.028 2103275.89, 4891259.082 2103275.69, 4891259.152 2103275.48, 4891259.363 2103275.093, 4891259.468 2103274.916, 4891259.715 2103274.565, 4891259.996 2103273.896, 4891260.523 2103273.298, 4891260.944 2103272.841, 4891261.19 2103272.525, 4891261.507 2103272.103, 4891261.717 2103271.751, 4891262.878 2103272.559, 4891264.25 2103273.578, 4891265.376 2103274.526, 4891266.924 2103275.615, 4891267.944 2103276.423, 4891268.858 2103277.197, 4891269.878 2103278.005, 4891271.25 2103278.989, 4891272.129 2103279.586, 4891272.2 2103279.621, 4891273.361 2103280.359, 4891274.873 2103281.096, 4891276.209 2103281.729, 4891277.194 2103282.29, 4891278.671 2103283.029, 4891279.269 2103283.239, 4891280.324 2103283.765, 4891281.238 2103284.223, 4891283.109 2103285.056, 4891283.243 2103284.749, 4891283.98 2103283.025, 4891285.351 2103281.267, 4891286.405 2103279.543, 4891287.143 2103277.995, 4891287.669 2103276.554, 4891288.467 2103275.485)))';
  ////const polygonWKT ='POINT (4891288.467 2103275.485)';
  const geoserver='https://tpzgeo.ceicol.com/geoserver/';//'https://vguamuez.ceicol.com:8443/geoserver/'
  const drawGeo='polygon';//'polygon'|'point'
  const cca_predio='31386'
  useEffect(() => {
    const esriWorldImageryStyle = {
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        'esri-world-imagery': {
          type: 'raster',
          // Patrón de teselas de Esri World Imagery
          // Fíjate que aquí se usa {z}/{y}/{x} en vez de {z}/{x}/{y}
          tiles: [
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'esri-world-imagery-layer',
          type: 'raster',
          source: 'esri-world-imagery',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    };
    /*maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
        true
    );*/
    // Inicializar el mapa
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current as unknown as HTMLElement,
      style: esriWorldImageryStyle as maplibregl.StyleSpecification , // Reemplaza con tu API key
      center: center,
      zoom: 12,
    });

    // Agregar controles de navegación
    mapRef.current.addControl(new maplibregl.NavigationControl());
    mapRef.current.addControl(new maplibregl.FullscreenControl());

    // Inicializar modos de Terra Draw
    const polygonMode = new TerraDrawPolygonMode({
      validation: (feature, { updateType }) => {
        if (updateType === 'finish' || updateType === 'commit') {
          return ValidateNotSelfIntersecting(feature);
        }
         return { valid: true };
      },
    });

    const pointMode = new TerraDrawPointMode({})

    const selectMode = new TerraDrawSelectMode({
      allowManualDeselection: true,
      flags: {
        point: {
          feature: {
            draggable: true,
          },
        },
        polygon: {
          feature: {
            draggable: false, // Ensure the entire polygon is not draggable
            coordinates: {
              midpoints: true,
              draggable: true, // Allow individual vertices to be draggable
              deletable: true,
              resizable: undefined, // Disable resizing to prevent altering all vertices
            },
          },
        },
      },
    });

    // Inicializar Terra Draw
    drawRef.current = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({
        map: mapRef.current
      }),
      modes: [selectMode, polygonMode,pointMode],
    });
    const loadLayers= () => {
       // Agregar capas y fuentes
      loadLayersRaster(mapRef,proyecto,geoserver);
      loadLayersVector(mapRef,proyecto,geoserver);
      if (polygonWKT != null) {
        // Manejar la conversión de WKT y ajuste del mapa
        const geojsonWKT = convertWKTToGeoJSON(polygonWKT);
        if (geojsonWKT && geojsonWKT?.type === "MultiPolygon") {
          const coordinates =getCoords(geojsonWKT)
          const newCoord = coordinates.map((polygon: number[][][]) => 
          polygon.map((line: number[][]) => 
              transformCoordinates(line as [number, number][],'EPSG:9377','WGS84') 
            )
          );
          const geo = turf.multiPolygon(newCoord);
          const type= 'fill';
          const paint= {
            'fill-color': '#088',
            'fill-opacity': 0.8,
          };
          loadGeom(mapRef,geo,type,paint);
        }else  if (geojsonWKT && geojsonWKT.type === 'Point') {
          console.log(geojsonWKT.coordinates);
          const coordinates = [geojsonWKT.coordinates]  as [number, number][]; 
          const newCoord = transformCoordinates(coordinates,'EPSG:9377','WGS84');
          const geo = turf.multiPoint(newCoord);
          const type= 'circle';
          const paint=  {
            'circle-radius': 10,
            'circle-color': '#3887be'
          };         
          loadGeom(mapRef,geo,type,paint);
        } else {
          console.error('Invalid GeoJSON structure');
        }
        
      } else {
        drawRef.current?.start();
        drawRef.current?.setMode(drawGeo);
      }
    }
    
    // Evento al cargar el mapa
    mapRef.current.on('load', () => {
      loadLayers();
    });

    

    // Evento al finalizar dibujo en Terra Draw
    drawRef.current.on('finish', (id: any, context: { action: any; }) => {
      const action = context.action;
      if (action === 'draw') {
        drawRef.current?.setMode('static');
      }
      getGeoJSONData();
    });

    
    const toggleSidebar = (id: string) => {
      const elem = document.getElementById(id);
      if (elem) {
        const collapsed = elem.classList.toggle('collapsed');
        const padding: Record<string, number> = {};
        padding[id] = collapsed ? 0 : 300;

        mapRef.current!.easeTo({
          padding: { left: 300 },
          duration: 1000,
        });
      }
    };

    window.toggleSidebar = toggleSidebar; // Exponer la función para poder ser usada en el DOM


    const OnChangeBase = (state: boolean) => {
      if (mapRef.current) {
        mapRef.current.setLayoutProperty('osm', 'visibility', state ? 'visible' : 'none');
      }
    };
    window.OnChangeBase = OnChangeBase; // Exponer la función para poder ser usada en el DOM

    const OnChangeLayer = (target: { checked: boolean; name: string }) => {
      if (mapRef.current) {
        mapRef.current.setLayoutProperty(target.name, 'visibility', target.checked ? 'visible' : 'none');
      }
    };
    window.OnChangeLayer = OnChangeLayer; // Exponer la función para poder ser usada en el DOM
    // Limpiar al desmontar
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [polygonWKT]);

  // Funciones para cambiar modos y borrar geometrías
  const switchToMode = () => {
    drawRef.current?.clear();
    drawRef.current?.setMode(drawGeo);
  };

  const switchToSelectMode = () => {
    drawRef.current?.setMode('select');
  };

  const deleteAllGeometries = () => {
    drawRef.current?.clear();
    drawRef.current?.setMode(drawGeo);
  };

  const getGeoJSONData = () => {
    const geojson = drawRef.current?.getSnapshot();
    if (!geojson || geojson.length === 0) {
      console.error('No GeoJSON data available');
      return;
    }

    // Wrap the features in a FeatureCollection
    const featureCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: geojson as GeoJSON.Feature[], // Ensure the type matches
    };

    const transformedGeoJSON = transformGeoJSON(featureCollection, 'WGS84', 'EPSG:9377');

    // Access the first feature correctly
    if (transformedGeoJSON.features.length > 0) {
      let wkt = wellknown.stringify(transformedGeoJSON.features[0].geometry as any);
      if(transformedGeoJSON.features[0].geometry.type==='Polygon'){
        wkt = wkt.replace('POLYGON ', 'MULTIPOLYGON (');
        wkt = wkt + ')';
      }
      console.log(wkt);      
    } else {
      console.error('No features available after transformation');
    }
  };

  const layerBaseHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerBase(event.target.checked);
    window.OnChangeBase(event.target.checked);
  };

  const layerHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const layerId = event.target.name;
    const visibility = event.target.checked ? 'visible' : 'none';
    mapRef.current?.setLayoutProperty(layerId, 'visibility', visibility);
  };

  const searchHandleLayer = (event: String) => {
      
      // Construye el filtro y la URL
      const cqlFilter = encodeURIComponent(`etiqueta in ('${event}')`);
      const url = `${geoserver}${proyecto}/wfs?service=WFS&srsName=EPSG:4326&version=1.1.0&request=GetFeature&CQL_FILTER=${cqlFilter}&typeName=${proyecto}:cca_terreno&outputFormat=application/json`;

      // Realiza la petición fetch
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((geojson) => {
          console.log('GeoJSON original:', geojson);

          // Verificamos que haya al menos una feature
          if (geojson.features.length > 0) {
            // Calcula el bounding box con Turf.js
            const bbox = turf.bbox(geojson);
            console.log('Bounding Box:', bbox);

            // Crea un polígono a partir de la bounding box (opcional si solo necesitas el bbox)
            const zone = turf.bboxPolygon(bbox);
            console.log('Zona (Polygon):', zone);

            // Realiza el zoom en el mapa utilizando mapRef.current
            if (mapRef.current) {
              const boundarySource = mapRef.current.getSource('boundary_source') as maplibregl.GeoJSONSource;

              // Actualiza la capa 'boundary_source' con la geometría obtenida
              if (boundarySource) {
                boundarySource.setData(geojson);
              }

              // Después de 5 segundos, resetea la fuente a un FeatureCollection vacío
              setTimeout(() => {
                if (mapRef.current) {
                  const boundarySourceTimeout = mapRef.current.getSource('boundary_source') as maplibregl.GeoJSONSource;
                  if (boundarySourceTimeout) {
                    boundarySourceTimeout.setData({
                      type: 'FeatureCollection',
                      features: []
                    });
                  }
                }
              }, 5000);

              // Ajusta la vista del mapa a la zona calculada
              // [[minLng, minLat], [maxLng, maxLat]]
              const bounds: [number, number, number, number] = [bbox[0], bbox[1], bbox[2], bbox[3]];
              mapRef.current.fitBounds(bounds, { padding: 20 });
            }
          } else {
            alert(`No se encontraron predios con el id operación ${event}!`);
          }
        })
        .catch((err) => {
          console.error('There has been a problem with your fetch operation:', err);
        });    
  
      
  };

  return (
      <div className="map-wrapper">
    <div ref={mapContainerRef} className="map-canvas">
      {/* Overlay de botones */}
      {polygonWKT === null && (
        <div className="map-toolbar">
          <button onClick={switchToMode}>Dibujar</button>
          <button onClick={switchToSelectMode}>Seleccionar</button>
          <button onClick={deleteAllGeometries}>Borrar Todo</button>
        </div>
      )}

      {/* Sidebar (si es flotante) */}
      <Sidebar
        checked={checked}
        layerBaseHandleChange={layerBaseHandleChange}
        layerHandleChange={layerHandleChange}
        searchHandleLayer={searchHandleLayer}
      />
    </div>
  </div>
  );
};

export default MapComponent;
