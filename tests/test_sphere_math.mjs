// SPDX-License-Identifier: Apache-2.0
// Long Ngo 2026 · Vietflexmap Copyright (c) 2025
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PI, TAU, dot3, icoVertices, ICOSAHEDRON_FACES,
  makeDodecahedralAtlas, geodesicPentagonMetrics, vertexJunctions,
  weak32, area2, strictPentagon, liftToSphere, greatCircleArc,
  latitudeRingMismatch
} from '../web/v5-sphere-math.js';

const approx=(value,expect,eps=1e-8)=>assert.ok(Math.abs(value-expect)<eps,String(value)+" != "+String(expect));

test('icosahedron dual creates 12 proper dodecahedral pentagonal roots',()=>{
  assert.equal(icoVertices.length,12);
  assert.equal(ICOSAHEDRON_FACES.length,20);
  const roots=makeDodecahedralAtlas();
  assert.equal(roots.length,12);
  for(const root of roots){
    assert.ok(strictPentagon(root.polygon));
    assert.equal(root.vertices.length,5);
    for(const vertex of root.vertices)approx(dot3(vertex,vertex),1);
  }
});

test('five 120-degree spherical angles imply positive excess pi/3 per root',()=>{
  const roots=makeDodecahedralAtlas();
  const metrics=roots.map(r=>geodesicPentagonMetrics(r));
  metrics.forEach(m=>{
    assert.equal(m.angles.length,5);
    for(const a of m.angles)approx(a,2*PI/3);
    approx(m.sum,10*PI/3);
    approx(m.excess,PI/3);
    approx(m.areaFraction,1/12);
  });
  approx(metrics.reduce((sum,m)=>sum+m.excess,0),4*PI);
});

test('20 triple vertices meet with angle sum 2 pi without numerical gap',()=>{
  const roots=makeDodecahedralAtlas();
  const joints=vertexJunctions(roots);
  assert.equal(joints.length,20);
  joints.forEach(v=>{
    assert.equal(v.incident.length,3);
    approx(v.angleSum,TAU);
    approx(v.residual,0);
  });
});

test('32-child sample partitions preserve planar area and corners',()=>{
  const roots=makeDodecahedralAtlas();
  for(const root of roots){
    const children=weak32(root.polygon);
    assert.equal(children.length,32);
    for(const child of children)assert.ok(strictPentagon(child));
    approx(children.reduce((s,c)=>s+area2(c),0),area2(root.polygon));
  }
});

test('two levels within a root produce 1,024 weak pentagons',()=>{
  const root=makeDodecahedralAtlas()[0];
  const cells=weak32(root.polygon).flatMap(weak32);
  assert.equal(cells.length,1024);
  assert.ok(cells.every(strictPentagon));
});

test('lifted edge endpoints are on the sphere and arcs interpolate',()=>{
  const root=makeDodecahedralAtlas()[0];
  const a=liftToSphere(root,root.polygon[0]),b=liftToSphere(root,root.polygon[1]);
  const arc=greatCircleArc(a,b,20,1);
  assert.equal(arc.length,21);
  arc.forEach(p=>approx(dot3(p,p),1));
  for(let k=0;k<3;k++){approx(arc[0][k],a[k]);approx(arc[20][k],b[k]);}
});

test('radial scale mismatch vanishes at lambda=1 but not at lambda<1',()=>{
  approx(latitudeRingMismatch(1,PI/3).fractionalMismatch,0);
  const m=latitudeRingMismatch(.5,PI/3);
  assert.ok(m.fractionalMismatch>.15 && m.fractionalMismatch<.16);
  assert.throws(()=>latitudeRingMismatch(0,PI/3),RangeError);
  assert.throws(()=>latitudeRingMismatch(1.5,PI/3),RangeError);
});
