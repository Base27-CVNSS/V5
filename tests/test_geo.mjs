// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDodecahedralAtlas} from '../web/v5-sphere-math.js';
import {latLngToCell,decodeCell,cellToPoint,cellToBoundary,cellParent,cellChildren,cellToGeoJSON,rootNeighbors,gridInfo,containsPlanar} from '../web/v5-geo.js';
test('root reference and reciprocal 5-neighbor topology',()=>{
 const roots=makeDodecahedralAtlas();
 for(let r=0;r<12;r++){
  const n=roots[r].normal,lat=Math.atan2(n[2],Math.hypot(n[0],n[1]))*180/Math.PI,lon=Math.atan2(n[1],n[0])*180/Math.PI;
  const id=latLngToCell(lat,lon,0);
  assert.equal(decodeCell(id).root,r);
  const neighbors=rootNeighbors(id);
  assert.equal(neighbors.length,5);
  for(const k of neighbors)assert.ok(rootNeighbors(k).includes(id));
 }
});
test('canonical codec, validation and security-negative cases',()=>{
 const c=latLngToCell(10.7769,106.7009,1);
 assert.match(c,/^0x[0-9a-f]{16}$/);
 assert.equal(decodeCell(c).resolution,1);
 assert.ok(cellChildren(cellParent(c)).includes(c));
 assert.equal(cellToGeoJSON(c).geometry.coordinates[0].length,6);
 assert.throws(()=>latLngToCell(NaN,10,0),RangeError);
 assert.throws(()=>latLngToCell(91,10,0),RangeError);
 assert.throws(()=>latLngToCell(20,Infinity,0),RangeError);
 assert.throws(()=>latLngToCell(0,0,3),RangeError);
 assert.throws(()=>decodeCell('__proto__'),TypeError);
 assert.throws(()=>decodeCell('0x0000000000000000'),RangeError);
 assert.equal(gridInfo().equalArea,false);
});
test('seeded global roundtrip for 3 research geometry levels',()=>{
 let seed=44255;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(let res=0;res<=2;res++){
  for(let i=0;i<60;i++){
   const lat=Math.asin(2*random()-1)*180/Math.PI,lon=random()*360-180;
   const id=latLngToCell(lat,lon,res);
   const [a,b]=cellToPoint(id);
   assert.equal(latLngToCell(b,a,res),id);
   assert.equal(cellToBoundary(id).length,5);
  }
 }
});
test('boundary-inclusive planar predicate',()=>{
 const p=[[0,0],[1,0],[1,1],[0,1]];
 assert.ok(containsPlanar(p,[0.5,0.5]));
 assert.ok(containsPlanar(p,[0,0.5]));
 assert.ok(!containsPlanar(p,[2,2]));
});
