// SPDX-License-Identifier: Apache-2.0
// Long Ngo 2026 · Vietflexmap Copyright (c) 2025
/**
 * Deterministic CSV -> aggregated weak V5 GeoJSON (research levels 0..2).
 * Node.js standard library only; intentionally bounded inputs.
 *
 * Usage: node scripts/geo_csv_to_geojson.mjs examples/v5_points.csv 1
 */
import {readFileSync,statSync} from 'node:fs';
import {latLngToCell,cellToGeoJSON} from '../web/v5-geo.js';
const argv=process.argv.slice(2);
function fail(message){throw new Error(message);}
function run(){
 if(argv.length!==2)fail('Usage: node scripts/geo_csv_to_geojson.mjs INPUT.csv RESOLUTION(0..2)');
 const [file,arg]=argv,res=Number(arg);
 if(!/^[012]$/.test(arg))fail('Geometry is certified only for research levels 0..2');
 const stat=statSync(file);
 if(!stat.isFile()||stat.size>1024*1024)fail('Input must be a regular CSV file <= 1 MiB');
 const lines=readFileSync(file,'utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/);
 if(lines.length<2||lines.length>10001)fail('CSV must contain 1..10000 points plus header');
 const header=lines.shift().trim().toLowerCase().replace(/\s+/g,'');
 if(header!=='lat,lon'&&header!=='latitude,longitude')fail('Expected exactly two columns: lat,lon');
 const counts=new Map();
 for(let i=0;i<lines.length;i++){
  const parts=lines[i].split(',');
  if(parts.length!==2||!parts.every(x=>x.trim()!==''))fail('Row '+(i+2)+' must contain two numeric fields');
  const [lat,lon]=parts.map(Number);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat < -90||lon < -180||lon > 180)
   fail('Invalid angular latitude/longitude in row '+(i+2));
  const cell=latLngToCell(lat,lon,res);
  counts.set(cell,(counts.get(cell)||0)+1);
 }
 const features=[...counts].sort(([a],[b])=>a.localeCompare(b)).map(([cell,count])=>{
  const f=cellToGeoJSON(cell);
  f.properties.point_count=count;
  return f;
 });
 const output={type:'FeatureCollection',name:'V5-experimental-point-aggregation',
  properties:{source_points:lines.length,resolution:res,
   disclaimer:'Unit sphere weak nonconforming cells; antimeridian split not implemented; NOT equal-area'},
  features};
 process.stdout.write(JSON.stringify(output,null,2)+'\n');
}
try{run();}catch(error){console.error('V5 CSV error:',error.message);process.exitCode=1;}
