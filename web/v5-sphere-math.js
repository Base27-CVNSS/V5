// SPDX-License-Identifier: Apache-2.0
// Long Ngo 2026 · Vietflexmap Copyright (c) 2025
//
// Pure mathematical primitives for the V5 spherical 3D research demo.
// Cells are radial projections of planar faces; weak 32-child subdivisions
// are NONCONVEX and may have hanging nodes. This is not a conforming DGGS.

export const TAU = 2 * Math.PI;
export const PI = Math.PI;
export const ICOSAHEDRON_FACES = Object.freeze([
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
]);
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTICES = [
  [-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],
  [0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],
  [PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1]
];
export const dot3 = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const add3 = (a,b) => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const mul3 = (a,t) => [a[0]*t,a[1]*t,a[2]*t];
export const cross3 = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const unit3 = a => mul3(a,1/Math.hypot(...a));
export const icoVertices = RAW_VERTICES.map(unit3);
export const clamp = (n,a=-1,b=1) => Math.max(a,Math.min(b,n));
export const degrees = r => r * 180/Math.PI;

const midpoint=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
const orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
export function area2(poly) {
  return poly.reduce((sum,p,i)=>{
    const q=poly[(i+1)%poly.length];
    return sum+p[0]*q[1]-q[0]*p[1];
  },0);
}
function touchesSegment(a,b,p) {
  return orient(a,b,p)===0 &&
    p[0]>=Math.min(a[0],b[0]) && p[0]<=Math.max(a[0],b[0]) &&
    p[1]>=Math.min(a[1],b[1]) && p[1]<=Math.max(a[1],b[1]);
}
function segmentsIntersect(a,b,c,d) {
  const x=orient(a,b,c),y=orient(a,b,d),u=orient(c,d,a),v=orient(c,d,b);
  return ((x>0&&y<0||x<0&&y>0)&&(u>0&&v<0||u<0&&v>0)) ||
    (x===0&&touchesSegment(a,b,c)) || (y===0&&touchesSegment(a,b,d)) ||
    (u===0&&touchesSegment(c,d,a)) || (v===0&&touchesSegment(c,d,b));
}
export function strictPentagon(poly) {
  if(!Array.isArray(poly)||poly.length!==5 ||
     poly.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v))) ||
     new Set(poly.map(p=>p.join(","))).size!==5 ||
     !(area2(poly)>0) ||
     !poly.every((p,i)=>Math.abs(orient(poly[(i+4)%5],p,poly[(i+1)%5]))>1e-15))
    return false;
  for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){
    if(j===i+1||(i===0&&j===4))continue;
    if(segmentsIntersect(poly[i],poly[(i+1)%5],poly[j],poly[(j+1)%5]))return false;
  }
  return true;
}
export function weakBinarySplit(poly) {
  for(let i=0;i<5;i++){
    const p=poly.slice(i).concat(poly.slice(0,i));
    const [a,b,c,d,e]=p;
    if(!(orient(a,b,c)>0 && orient(a,c,d)>0 && orient(a,d,e)>0)) continue;
    const q=midpoint(c,d),m=midpoint(a,q),dx=q[0]-a[0],dy=q[1]-a[1];
    for(let power=5;power<30;power++){
      for(const sign of [1,-1]){
        const eps=sign/2**power;
        const t=[m[0]-eps*dy,m[1]+eps*dx];
        if(!(orient(a,c,t)>0 && orient(c,d,t)>0 && orient(d,a,t)>0)) continue;
        const left=[a,b,c,q,t],right=[a,t,q,d,e];
        if(strictPentagon(left) && strictPentagon(right)) return [left,right];
      }
    }
  }
  throw new Error("No admissible weak bent-chord split found");
}
export function weak32(poly) {
  let cells=[poly];
  for(let i=0;i<5;i++) cells=cells.flatMap(weakBinarySplit);
  return cells;
}

export function makeDodecahedralAtlas() {
  // Each icosahedron vertex is dual to one dodecahedral pentagonal face.
  // The centroids of the adjacent icosahedral triangles are the face corners.
  const faceCenters=ICOSAHEDRON_FACES.map(t=>{
    const centroid=mul3(t.reduce((sum,i)=>add3(sum,icoVertices[i]),[0,0,0]),1/3);
    return centroid;
  });
  const roots=icoVertices.map((normal,id)=>{
    let u=cross3([0,0,1],normal);
    if(Math.hypot(...u)<1e-8)u=cross3([0,1,0],normal);
    u=unit3(u);
    const v=unit3(cross3(normal,u));
    const corners=ICOSAHEDRON_FACES.map((f,i)=>({f,i}))
      .filter(({f})=>f.includes(id))
      .map(({i})=>faceCenters[i]);
    if(corners.length!==5)throw new Error("Invalid dodecahedral incidence");
    const planeDistance=dot3(corners[0],normal);
    const projected=corners.map(p=>({xyz:p,uv:[dot3(p,u),dot3(p,v)]}));
    projected.sort((a,b)=>Math.atan2(a.uv[1],a.uv[0])-Math.atan2(b.uv[1],b.uv[0]));
    const polygon=projected.map(p=>p.uv);
    if(!strictPentagon(polygon))throw new Error("Root polygon orientation invalid");
    return {id,normal,u,v,planeDistance,polygon,vertices:projected.map(p=>unit3(p.xyz))};
  });
  return roots;
}
export function liftToSphere(root,point) {
  return unit3(add3(mul3(root.normal,root.planeDistance),
                   add3(mul3(root.u,point[0]),mul3(root.v,point[1]))));
}
export function sphericalAngle(a,b,c) {
  // Two outgoing tangent vectors at b toward a and c (short geodesics).
  const ta=unit3(add3(a,mul3(b,-dot3(a,b))));
  const tc=unit3(add3(c,mul3(b,-dot3(c,b))));
  return Math.acos(clamp(dot3(ta,tc)));
}
export function geodesicPentagonMetrics(root,polygon=root.polygon) {
  const spherePoints=polygon.map(p=>liftToSphere(root,p));
  const angles=polygon.map((p,i)=>{
    const prev=(i+4)%5,next=(i+1)%5;
    const smaller=sphericalAngle(spherePoints[prev],spherePoints[i],spherePoints[next]);
    const turning=orient(polygon[prev],p,polygon[next]);
    return turning>=0?smaller:TAU-smaller;
  });
  const sum=angles.reduce((a,b)=>a+b,0);
  const excess=sum-3*PI;
  return {angles,sum,excess,areaOnUnitSphere:excess,areaFraction:excess/(4*PI),
    degrees:angles.map(degrees)};
}
export function vertexJunctions(roots) {
  const locations=[];
  for(const root of roots){
    for(let i=0;i<5;i++){
      const p=root.vertices[i];
      let vertex=locations.find(v=>dot3(p,v.position)>1-1e-9);
      if(!vertex) {vertex={id:locations.length,position:p,incident:[]};locations.push(vertex);}
      const metrics=geodesicPentagonMetrics(root);
      vertex.incident.push({face:root.id,angle:metrics.angles[i]});
    }
  }
  return locations.map(v=>({...v,angleSum:v.incident.reduce((s,x)=>s+x.angle,0),
                           residual:v.incident.reduce((s,x)=>s+x.angle,0)-TAU}));
}
export function latitudeRingMismatch(lambda,thetaRadians){
  if(!(lambda>0 && lambda<=1) || !(thetaRadians>0 && thetaRadians<Math.PI))
    throw new RangeError("Require 0 < λ ≤ 1 and 0 < θ < π");
  const actual=Math.sin(lambda*thetaRadians);
  const predicted=lambda*Math.sin(thetaRadians);
  return {actualCircumference:2*Math.PI*actual,
          hypotheticalSimilarityCircumference:2*Math.PI*predicted,
          fractionalMismatch:(actual-predicted)/predicted};
}
export function greatCircleArc(a,b,segments=12,radius=1.008){
  const omega=Math.acos(clamp(dot3(a,b))),sin=Math.sin(omega);
  const pts=[];
  for(let k=0;k<=segments;k++){
    const t=k/segments;
    const p=(Math.abs(sin)<1e-12)?unit3(add3(mul3(a,1-t),mul3(b,t))):
      unit3(add3(mul3(a,Math.sin((1-t)*omega)/sin),
                 mul3(b,Math.sin(t*omega)/sin)));
    pts.push(mul3(p,radius));
  }
  return pts;
}
