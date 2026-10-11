// SPDX-License-Identifier: Apache-2.0
/** Measured LOCAL V5 microbenchmark, not a comparable H3/S2/A5 performance claim. */
import {performance} from 'node:perf_hooks';
import {cpus,arch,platform} from 'node:os';
import {latLngToCell,decodeCell,cellToBoundary} from '../web/v5-geo.js';
const n=Number(process.argv[2]||200),res=Number(process.argv[3]||1);
if(!Number.isInteger(n)||n<20||n>5000||!Number.isInteger(res)||res<0||res>2){
 console.error('Usage: node scripts/benchmark_geo.mjs [20..5000] [0..2]');process.exitCode=2;
}else{
 let seed=1431;
 const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 const inputs=Array.from({length:n},()=>[Math.asin(2*rnd()-1)*180/Math.PI,360*rnd()-180]);
 for(const p of inputs.slice(0,30))latLngToCell(...p,res);
 const times=[];
 for(let i=0;i<5;i++){
  const t=performance.now();
  const ids=inputs.map(p=>latLngToCell(...p,res));
  times.push((performance.now()-t)*1000/n);
  if(i===0){ids.forEach(decodeCell);ids.slice(0,30).forEach(cellToBoundary);}
 }
 times.sort((a,b)=>a-b);
 console.log(JSON.stringify({status:'measured-local-only',algorithm:'V5 weak unit-sphere lookup',
  reference:'NOT comparable to H3/S2/A5 without matched area/accuracy and workloads',
  samples:n,resolution:res,medianUsPerLookup:times[2],passes:5,
  environment:{node:process.version,platform:platform(),arch:arch(),cpu:cpus()[0]?.model}},null,2));
}
