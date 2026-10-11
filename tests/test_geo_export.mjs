// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
const script=new URL('../scripts/geo_csv_to_geojson.mjs',import.meta.url).pathname;
const fixture=new URL('../examples/v5_points.csv',import.meta.url).pathname;
test('GIS export CLI emits valid FeatureCollection with mass-conserving counts',()=>{
 const out=execFileSync(process.execPath,[script,fixture,'1'],{encoding:'utf8'});
 const json=JSON.parse(out);
 assert.equal(json.type,'FeatureCollection');
 assert.equal(json.properties.source_points,6);
 assert.ok(json.features.length>=1);
 assert.equal(json.features.reduce((s,f)=>s+f.properties.point_count,0),6);
 for(const f of json.features){
  assert.match(f.properties.id,/^0x[0-9a-f]{16}$/);
  assert.equal(f.geometry.type,'Polygon');
  assert.equal(f.geometry.coordinates[0].length,6);
 }
});
test('GIS export CLI rejects invalid resolutions and missing files',()=>{
 let out=spawnSync(process.execPath,[script,fixture,'10'],{encoding:'utf8'});
 assert.notEqual(out.status,0);
 assert.match(out.stderr,/0\.\.2/);
 out=spawnSync(process.execPath,[script,'does-not-exist.csv','1'],{encoding:'utf8'});
 assert.notEqual(out.status,0);
});
