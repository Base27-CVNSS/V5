# V5 → GeoJSON / QGIS / PostGIS / MapLibre integration

**Scope**: V5 experimental angular unit-sphere adapter at resolutions 0–2 only, using nonconforming weak pentagons. This is an integration example, **not** a certified DGGS, WGS84 ellipsoid geodesic, antimeridian-safe polygon layer or accuracy guarantee.

## 1. Export test points from CSV to GeoJSON

Requirements: Node.js 22+, no npm dependencies. Input is a simple two-column CSV with header `lat,lon` or `latitude,longitude`, a maximum of 10,000 points and 1 MiB; range is latitude [-90,90] longitude [-180,180]. Only resolution 0, 1 or 2.

```bash
node scripts/geo_csv_to_geojson.mjs examples/v5_points.csv 1 > v5_cells.geojson
```

Export creates a FeatureCollection of **aggregated point counts** by V5 CellID with a stable, sorted order. It never claims equal area. The importer can be tested with `node --test tests/test_geo_export.mjs`.

## 2. QGIS

Open QGIS → Layer → Add Layer → Add Vector Layer; open v5_cells.geojson. Style classified by `point_count` and label with `id`. **Do not use these cell polygons to calculate official parcel areas or length**; the geometric model is experimental and crosses the antimeridian without RFC 7946 splitting. This sample dataset intentionally covers only mainland Vietnam.

## 3. PostGIS + GDAL/OGR

```bash
ogr2ogr -f PostgreSQL "PG:host=localhost dbname=gis user=gis" v5_cells.geojson -nln v5_cells_demo -overwrite -lco GEOMETRY_NAME=geom
```

Use a string/text column for canonical `0x...` V5-64 IDs; do **not** coerce them into JavaScript Number or signed 64-bit integer storage. Create a GiST index on imported polygon geometries for demonstration only:

```sql
CREATE INDEX v5_cells_demo_geom_gix ON v5_cells_demo USING GIST (geom);
ANALYZE v5_cells_demo;
```

The data is an illustrative lon/lat geometry collection. It is not fit for cadastral or WGS84 ellipsoidal area measurement.

## 4. MapLibre GL JS

Load the emitted GeoJSON into a MapLibre source using `map.addSource('v5',{type:'geojson',data:featureCollection})` and draw as fill or line layers. This is a client-side visualization contract, not a MapLibre dependency bundled with the repository. Avoid presenting dateline-crossing cells as valid clipped polygons.

## 5. Acceptance criteria for production GIS interoperability

- Independent polygon validity tests (including anti-meridian, 12 root seams, topology, area).
- CRS metadata and ellipsoidal transform definition, complete per-level geometry.
- H3/S2/A5 matched-resolution comparison, spatial join/cover operator and repeatable performance measurements.
- QGIS and PostGIS automated import/export regression, and official OGC conformance.

Only **sample CSV→GeoJSON aggregation** plus existing browser-level GeoJSON export are implemented. Other items above are integration instructions or open gates.
