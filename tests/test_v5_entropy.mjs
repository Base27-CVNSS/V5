// SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import {capacityStats} from '../web/v5-entropy.js';

test('hypothetical 5-way / three-bit digit has precisely 77.3976% capacity efficiency',()=>{
  const x=capacityStats(5,15,3);
  assert.equal(x.allocated,45);
  assert.equal(x.denseBits,35);
  assert.equal(x.reclaimableIntegerBits,10);
  assert.ok(Math.abs(x.capacityEfficiency-Math.log2(5)/3)<1e-12);
  assert.ok(Math.abs(100*x.capacityEfficiency-77.3976)<.0001);
  assert.ok(x.theoreticalOverhead>10 && x.theoreticalOverhead<11);
});
test('existing V5-32 uses full five-bit digit space with no spare path codewords',()=>{
  const x=capacityStats(32,10,5);
  assert.equal(x.allocated,50);
  assert.equal(x.denseBits,50);
  assert.equal(x.reclaimableIntegerBits,0);
  assert.equal(x.capacityEfficiency,1);
  assert.equal(x.possiblePaths,32n**10n);
});
test('same uint64 storage remains eight bytes regardless of entropy ratio',()=>{
  const five=capacityStats(5,15,3);
  const thirtyTwo=capacityStats(32,10,5);
  assert.equal(64/8,8);
  assert.ok(five.capacityEfficiency<thirtyTwo.capacityEfficiency);
});
test('reject invalid alphabets or budgets',()=>{
  for(const args of [[5,0,3],[33,10,5],[5,15,2],[32,11,0],[5,2.5,3]]){
    assert.throws(()=>capacityStats(...args),RangeError);
  }
});
