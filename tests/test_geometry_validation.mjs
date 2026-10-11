// SPDX-License-Identifier: Apache-2.0
// Regression: numerical 3D preview has the same basic simple-polygon contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import { strictPentagon, makeDodecahedralAtlas, weak32, area2 } from '../web/v5-sphere-math.js';

test('reject self-crossing positive-signed-area pentagram', () => {
  const star=[[0,5],[-3,-3],[5,2],[-5,2],[3,-3]];
  assert.ok(area2(star)>0);
  assert.equal(strictPentagon(star),false);
});

test('reject malformed nonfinite, repeated or concave-invalid vertices',()=>{
  assert.equal(strictPentagon([[0,0],[1,0],[2,0],[2,2],[0,2]]),false);
  assert.equal(strictPentagon([[0,0],[1,0],[2,0],[2,2],[0,0]]),false);
  assert.equal(strictPentagon([[0,0],[1,0],[2,1],[0,2],[NaN,0]]),false);
});

test('all 12 dodecahedral roots still yield strict weak32 samples',()=>{
  const roots=makeDodecahedralAtlas();
  assert.equal(roots.length,12);
  for(const root of roots){
    const cells=weak32(root.polygon);
    assert.equal(cells.length,32);
    assert.ok(cells.every(strictPentagon));
  }
});
