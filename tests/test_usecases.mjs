// SPDX-License-Identifier: Apache-2.0
// V5 research use case catalog and deterministic synthetic math tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {useCases,categories,gates} from '../web/v5-usecases-data.js';
import {encodeV564,weightedMean,hierarchyAtResolution} from '../web/v5-usecases-math.js';

test('catalog contains exactly 50 sequential and unique cases across 7 domains',()=>{
  assert.equal(useCases.length,50);
  assert.equal(categories.length,7);
  assert.deepEqual(useCases.map(x=>x.id),Array.from({length:50},(_,i)=>i+1));
  assert.deepEqual(categories.map(c=>c.count),[10,5,10,7,6,6,6]);
  for(const cat of categories){
    assert.equal(useCases.filter(x=>x.category===cat.id).length,cat.count);
  }
  assert.equal(new Set(useCases.map(x=>x.title)).size,50);
});
test('each research case names input, method, falsifiable hypothesis, blocker and metric',()=>{
  for(const x of useCases){
    for(const key of ['category','title','input','method','hypothesis','gate','metric','status']){
      assert.ok(typeof x[key]==='string' && x[key].trim().length>=3, `id ${x.id} missing ${key}`);
    }
    assert.ok(gates[x.status],`id ${x.id} invalid maturity status`);
  }
});
test('64-bit encoding matches reference and rejects incompatible layouts',()=>{
  assert.equal(encodeV564(0,[]),'0x1000000000000000');
  assert.equal(encodeV564(7,[2,0,4]),'0x131c402000000000');
  assert.equal(encodeV564(11,Array(10).fill(31)),'0x1a2fffffffffffff');
  for(const args of [[12,[]],[-1,[]],[0,[32]],[0,Array(11).fill(1)],[0,[true]],[0,[1],2],[true,[]]]){
    assert.throws(()=>encodeV564(...args),RangeError);
  }
});
test('area weighted mean uses real weights, not cell-average assumption',()=>{
  const cells=[{area:1,val:20},{area:2,val:50},{area:.5,val:80}];
  assert.ok(Math.abs(weightedMean(cells)-160/3.5)<1e-12);
  assert.notEqual(weightedMean(cells),50);
  assert.equal(weightedMean([{area:2,val:5},{area:2,val:7}]),6);
  for(const a of [[],[{area:0,val:1}],[{area:-1,val:1}],[{area:1,val:NaN}]]){
    assert.throws(()=>weightedMean(a),RangeError);
  }
});
test('level counts are BigInts; v1 is restricted to ten levels',()=>{
  assert.equal(hierarchyAtResolution(0).count,12n);
  assert.equal(hierarchyAtResolution(3).count,393216n);
  assert.equal(hierarchyAtResolution(5).count,402653184n);
  assert.equal(hierarchyAtResolution(10).count,13510798882111488n);
  assert.equal(hierarchyAtResolution(10).pathBits,50);
  assert.throws(()=>hierarchyAtResolution(11),RangeError);
});
test('website has live use-case catalogue with external JS and matching markdown reference',()=>{
  const html=readFileSync(new URL('../use-cases.html',import.meta.url),'utf8');
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const proof=readFileSync(new URL('../mathematical-proof.html',import.meta.url),'utf8');
  const md=readFileSync(new URL('../docs/USE_CASES_50_VI.md',import.meta.url),'utf8');
  for(const id of ['catalog-list','catalog-filters','case-search','lab-encode','lab-level','lab-weighted'])assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('src="./web/v5-usecases.js"'));
  assert.ok(html.includes("script-src 'self'"));
  assert.ok(index.includes('href="use-cases.html"'));
  assert.ok(proof.includes('href="use-cases.html"'));
  assert.ok(md.includes('32 con/cha'));
});
