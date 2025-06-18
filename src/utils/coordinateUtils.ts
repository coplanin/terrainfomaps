import proj4 from 'proj4';
import wellknown from 'wellknown';
import * as turf from 'turf';

// Definir EPSG:9377
proj4.defs(
  'EPSG:9377',
  '+proj=tmerc +lat_0=4 +lon_0=-73 +k=0.9992 +x_0=5000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);

export const transformCoordinates = (
  coords: [number, number][],
  fromProj: string,
  toProj: string
): [number, number][] => {
  return coords.map((coord) => proj4(fromProj, toProj, coord) as [number, number]);
};

export const transformGeoJSON = (
  geojson: GeoJSON.FeatureCollection,
  fromProj: string,
  toProj: string
): GeoJSON.FeatureCollection => {
  const transformedGeoJSON = JSON.parse(JSON.stringify(geojson)) as GeoJSON.FeatureCollection;

  if (!Array.isArray(transformedGeoJSON.features)) {
    console.error('Invalid GeoJSON: features is not an array');
    return transformedGeoJSON;
  }

  transformedGeoJSON.features = transformedGeoJSON.features.map((feature) => {
    
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates = feature.geometry.coordinates.map((ring) =>
        transformCoordinates(ring as [number, number][], fromProj, toProj)
      );
    }
    if (feature.geometry.type === 'Point') {
      const coordinates = [feature.geometry.coordinates]  as [number, number][]; 
      const newCoord = transformCoordinates(coordinates,'WGS84','EPSG:9377');
      const geo = turf.point(newCoord[0]);
      feature =geo;
    }
    return feature;
  });

  return transformedGeoJSON;
};

export const convertWKTToGeoJSON = (wkt: string): GeoJSON.Geometry | null => {
  try {
    const geojson = wellknown.parse(wkt);
    return geojson;
  } catch (error) {
    console.error('Error al convertir WKT a GeoJSON:', error);
    return null;
  }
};
