// SPDX-License-Identifier: Apache-2.0
// UI/UX architecture and honest mathematical visualization contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gridMetrics,matrixRows,sphericalPentagonAngles,theoreticalCellCount} from '../web/v5-metrics.js';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
test('H3/S2/V5 architectural comparisons are documented, not speculative timings',()=>{
 assert.deepEqual(gridMetrics.roots.values,[122,6,12]);
 assert.deepEqual(gridMetrics.depth.values,[15,30,10]);
 assert.deepEqual(gridMetrics.branch.values,[7,4,32]);
 assert.deepEqual(gridMetrics.bits.values,[64,64,64]);
 assert.equal(matrixRows.length,8);
 assert.ok(matrixRows.every(x=>x.vals.length===3 && x.vals.every(v=>['yes','limited','open','na'].includes(v))));
 assert.ok(!('performance' in gridMetrics));
});
test('Gauss-Bonnet spherical pentagon area excess and 64-bit hierarchy exactness',()=>{
 const R=6371;
 const A=Math.PI*(R**2)/180; // exactly one degree spherical excess
 const x=sphericalPentagonAngles(A,R);
 assert.ok(Math.abs(x.excessDegrees-1)<1e-12);
 assert.ok(Math.abs(x.angleSumDegrees-541)<1e-12);
 assert.ok(sphericalPentagonAngles(10000).angleSumDegrees>540);
 assert.throws(()=>sphericalPentagonAngles(0),RangeError);
 assert.throws(()=>sphericalPentagonAngles(10,0),RangeError);
 assert.throws(()=>sphericalPentagonAngles(2*Math.PI*R**2,R),RangeError);
 assert.equal(theoreticalCellCount(0),12n);
 assert.equal(theoreticalCellCount(3),393216n);
 assert.equal(theoreticalCellCount(10),13510798882111488n);
 assert.throws(()=>theoreticalCellCount(11),RangeError);
});
test('all four page templates share V5 Web3 stylesheet without losing core anchors',()=>{
 const pages=['../index.html','../mathematical-proof.html','../technical-specification.html','../use-cases.html'];
 for(const page of pages){
  const html=read(page);
  assert.match(html,/class="v5-web3/);
  assert.ok(html.includes('./web/v5-web3.css'));
  assert.ok(html.includes("Content-Security-Policy"));
  assert.ok(html.includes("name=\"referrer\""));
 }
 const home=read('../index.html');
 for(const id of ['heroSvg','v5-globe-stage','explorer','simulation3d','comparison-lab','v5-matrix-body','v5-bars','v5-area','v5-gb-angle-value','mathematics','implementation']){
   assert.ok(home.includes(`id="${id}"`),`Missing existing/new feature: ${id}`);
 }
 assert.ok(home.includes('src="./web/v5-orb.svg"'));
 assert.ok(home.includes('src="./web/v5-compare.js"'));
 assert.ok(home.includes('src="./web/v5-i18n.js"'));
});
test('bilingual locale keys cover every decorated home element',()=>{
 const home=read('../index.html'),i18n=read('../web/v5-i18n.js');
 const keys=[...home.matchAll(/data-v5-t="([^"]+)"/g)].map(x=>x[1]);
 assert.ok(keys.length>20);
 for(const key of keys)assert.ok(i18n.includes('"'+key+'"'),`Missing bilingual key ${key}`);
 assert.ok(i18n.includes('document.documentElement')||i18n.includes('const root=document.documentElement'));
});
test('no dishonest computed score or unverified V5 benchmark claim',()=>{
 const compare=read('../web/v5-compare.js');
 assert.ok(compare.includes('gridMetrics[chosen]'));
 assert.ok(compare.includes('sphericalPentagonAngles(A)'));
 const html=read('../index.html');
 assert.ok(html.includes('not a performance benchmark'));
 assert.ok(html.includes('V5-32 remains a research reference'));
});
