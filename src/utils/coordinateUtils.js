// src/utils/coordinateUtils.js

import proj4 from 'proj4';
import wellknown from 'wellknown';

// Definir EPSG:9377
proj4.defs(
  'EPSG:9377',
  '+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);

export const transformCoordinates = (coords, fromProj, toProj) => {
  return coords.map((coord) => proj4(fromProj, toProj, coord));
};

export const transformGeoJSON = (geojson, fromProj, toProj) => {
  const transformedGeoJSON = JSON.parse(JSON.stringify(geojson));
  transformedGeoJSON.features = transformedGeoJSON.map((feature) => {
    feature.geometry.coordinates[0] = transformCoordinates(
      feature.geometry.coordinates[0],
      fromProj,
      toProj
    );
    return feature;
  });
  return transformedGeoJSON;
};

export const convertWKTToGeoJSON = (wkt) => {
  try {
    const geojson = wellknown.parse(wkt);
    return geojson;
  } catch (error) {
    console.error('Error al convertir WKT a GeoJSON:', error);
    return null;
  }
};
