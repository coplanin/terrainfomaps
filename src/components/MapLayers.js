export const loadLayersRaster = (mapRef,proyecto) => {


    mapRef.current.addSource('osm', {
    type: 'raster',
    tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
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
        'id': 'cca_ortofoto_cog',
         'type': 'raster',
         'source': {
            'type': 'raster',
              'tiles': [
                'http://coplanin.com.co/geoserver/'+proyecto+'/wms?SERVICE=WMS&VERSION=1.1.1&'+
                'REQUEST=GetMap&FORMAT=image%2Fpng&'+
                'TRANSPARENT=true&STYLES&'+
                'LAYERS='+proyecto+':cca_ortofoto_cog&'+
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
};
export const loadLayersVector = (mapRef,proyecto) => {
    mapRef.current.addLayer({
        'id': 'cca_terreno',
        'source-layer': 'cca_terreno',
         'source': {
            'type': 'vector',
              'tiles': [
                'http://coplanin.com.co/geoserver/'+proyecto+'/wms?SERVICE=WMS&VERSION=1.1.1&'+
                'REQUEST=GetMap&FORMAT=application/vnd.mapbox-vector-tile&'+
                'TRANSPARENT=true&STYLES&'+
                'LAYERS='+proyecto+':cca_terreno&'+
                'WIDTH=256'+
                '&HEIGHT=256'+
                '&SRS=EPSG%3A3857'+
                '&exceptions=application/vnd.ogc.se_blank'+
                '&tiled=false '+
                '&bbox={bbox-epsg-3857}'
              ]
         },
         'type': 'line',
         'paint': {
                'line-color': 'red',
                'line-width': 2
          }
      });
      mapRef.current.setLayoutProperty('cca_terreno', 'visibility', 'visible');
      mapRef.current.addLayer({
        'id': 'cca_unidadconstruccion',
        'source-layer': 'cca_unidadconstruccion',
         'source': {
            'type': 'vector',
              'tiles': [
                'http://coplanin.com.co/geoserver/'+proyecto+'/wms?SERVICE=WMS&VERSION=1.1.1&'+
                'REQUEST=GetMap&FORMAT=application/vnd.mapbox-vector-tile&'+
                'TRANSPARENT=true&STYLES&'+
                'LAYERS='+proyecto+':cca_unidadconstruccion&'+
                'WIDTH=256'+
                '&HEIGHT=256'+
                '&SRS=EPSG%3A3857'+
                '&exceptions=application/vnd.ogc.se_blank'+
                '&tiled=false '+
                '&bbox={bbox-epsg-3857}'
              ]
         },
         'type': 'fill',
         'paint': {
            "fill-opacity": 0.7,
            "fill-color": "grey",
            "fill-outline-color": "black",
          }
      });
      mapRef.current.setLayoutProperty('cca_unidadconstruccion', 'visibility', 'visible');
};
  
