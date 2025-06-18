import { Map } from 'maplibre-gl';
import * as turf from 'turf';

export const loadLayersRaster = (mapRef: any, proyecto: string,geoserver: string): void => {
  if (!mapRef.current) return;

  mapRef.current.addSource('osm', {
    type: 'raster',
    tiles: [
        
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    tileSize: 256,
  });

  mapRef.current.addLayer({
    id: 'osm',
    type: 'raster',
    source: 'osm',
  });

  mapRef.current.setLayoutProperty('osm', 'visibility', 'visible');

  mapRef.current.addLayer({
    id: 'cca_ortofoto_cog',
    type: 'raster',
    source: {
      type: 'raster',
      tiles: [
        geoserver + proyecto + '/gwc/service/wmts?' +
          'layer='+proyecto+':cca_ortofoto_cog&style=&tilematrixset=WebMercatorQuadx2&' +
          'Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&' +
          // Usamos {z}, {x}, {y} para que Mapbox gestione las peticiones:
          'TileMatrix={z}&TileRow={y}&TileCol={x}'
      ],
      tileSize: 256
    }
  });

  
  mapRef.current.setLayoutProperty('cca_ortofoto_cog', 'visibility', 'visible');


};

export const loadLayersVector = (mapRef: any, proyecto: string,geoserver: string): void => {
  if (!mapRef.current) return;
  mapRef.current.addLayer({
    id: 'cca_unidadconstruccion',
    'source-layer': 'cca_unidadconstruccion',
    source: {
      type: 'vector',
      tiles: [
        geoserver + proyecto + '/wms?SERVICE=WMS&VERSION=1.1.1&' +
        'REQUEST=GetMap&FORMAT=application/vnd.mapbox-vector-tile&' +
        'TRANSPARENT=true&STYLES&' +
        'LAYERS=' + proyecto + ':cca_unidadconstruccion&' +
        'WIDTH=256' +
        '&HEIGHT=256' +
        '&SRS=EPSG%3A3857' +
        '&exceptions=application/vnd.ogc.se_blank' +
        '&tiled=false ' +
        '&bbox={bbox-epsg-3857}'
      ]
    },
    type: 'fill',
    paint: {
      'fill-color': '#FFA500',
      'fill-outline-color': 'black',
    }
  });

  mapRef.current.setLayoutProperty('cca_unidadconstruccion', 'visibility', 'visible');
 
  mapRef.current.addLayer({
    id: 'cca_terreno',
    'source-layer': 'cca_terreno',
    source: {
      type: 'vector',
      tiles: [
        geoserver + proyecto + '/wms?SERVICE=WMS&VERSION=1.1.1&' +
        'REQUEST=GetMap&FORMAT=application/vnd.mapbox-vector-tile&' +
        'TRANSPARENT=true&STYLES&' +
        'LAYERS=' + proyecto + ':cca_terreno&' +
        'WIDTH=256' +
        '&HEIGHT=256' +
        '&SRS=EPSG%3A3857' +
        '&exceptions=application/vnd.ogc.se_blank' +
        '&tiled=false ' +
        '&bbox={bbox-epsg-3857}'
      ]
    },
    type: 'line',
    paint: {
      'line-color': 'red',
      'line-width': 2.5
    }
  });

  mapRef.current.setLayoutProperty('cca_terreno', 'visibility', 'visible');

  // Agregar capa para etiquetas cuando el zoom sea mayor a 19
  mapRef.current.addLayer({
    id: 'cca_terreno_center',
    'source-layer': 'cca_terreno_center',
     source: {
      type: 'vector',
      tiles: [
        geoserver + proyecto + '/wms?SERVICE=WMS&VERSION=1.1.1&' +
        'REQUEST=GetMap&FORMAT=application/vnd.mapbox-vector-tile&' +
        'TRANSPARENT=true&STYLES&' +
        'LAYERS=' + proyecto + ':cca_terreno_center&' +
        'WIDTH=256' +
        '&HEIGHT=256' +
        '&SRS=EPSG%3A3857' +
        '&exceptions=application/vnd.ogc.se_blank' +
        '&tiled=false ' +
        '&bbox={bbox-epsg-3857}'
      ]
    },
    type: 'symbol',
    minzoom: 18, // Se muestra a partir del zoom 18
    layout: {
      "symbol-placement": "point", // Centrado en polígonos
      'text-field': ['get', 'etiqueta'],
      'text-radial-offset': 20,
      'text-justify': 'auto',
      'text-size': 11,
      'text-allow-overlap': false // Evita que se solapen etiquetas
    },
    paint: {
      'text-color': '#000000',       // Texto en negro
      'text-halo-color': '#ffffff',  // Borde blanco
      'text-halo-width': 2           // Grosor del borde (ajustable)
    }
  });

  mapRef.current.setLayoutProperty('cca_terreno_center', 'visibility', 'visible');

  mapRef.current.addSource('boundary_source', {
    type: 'geojson',
    data: {
      "type": "FeatureCollection",
      "features": []
    }  // Podrías usar también una URL, ej: 'data/archivo.geojson'
  });

  mapRef.current.addLayer({
    id: 'boundary_layer',
    type: 'line',
    source: 'boundary_source',
    paint: {
      'line-color': 'cyan',
      'line-width': 4
    }
  });

  mapRef.current.setLayoutProperty('boundary_layer', 'visibility', 'visible');

};

export const loadGeom = (mapRef: any,geo:any, type: string,paint: any): void => {
  if (!mapRef.current) return;

  mapRef.current?.addSource('geojsonWKT', {
    type: 'geojson',
    data: geo,
  });
  mapRef.current?.addLayer({
    id: 'geojsonWKT',
    type: type,
    source: 'geojsonWKT',
    layout: {},
    paint: paint
  });
  const bboxPolygon = turf.bbox(geo as any);
  mapRef.current?.fitBounds([
    [bboxPolygon[0], bboxPolygon[1]],
    [bboxPolygon[2], bboxPolygon[3]]
  ], {
    padding: 20,
  });
}