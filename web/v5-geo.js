// SPDX-License-Identifier: Apache-2.0
// Long Ngo 2026 · Vietflexmap Copyright (c) 2025
/** Experimental V5 weak-cell geolocation on the unit sphere, levels 0..2 only.
 * NOT ellipsoidal WGS84, equal-area, edge-to-edge or OGC conformant.
 */
import {icoVertices, ICOSAHEDRON_FACES, dot3, makeDodecahedralAtlas, liftToSphere, weakBinarySplit} from './v5-sphere-math.js';
export const MAX_GEO_RESOLUTION=2;
const ATLAS=makeDodecahedralAtlas();
const normalizeLon=x=>((x+180)%360+360)%360-180;
function checkLevel(level){
 if(!Number.isInteger(level)||level<0||level>MAX_GEO_RESOLUTION)throw new RangeError('Only geometric levels 0..2 validated');
}
function checkCoordinates(lat,lon){
 if(typeof lat!=='number'||typeof lon!=='number'||!Number.isFinite(lat)||!Number.isFinite(lon)||lat < -90||lat >90)
  throw new RangeError('Latitude must be [-90,90] and longitude finite');
}
function unitVector(lat,lon){
 const p=lat*Math.PI/180,t=normalizeLon(lon)*Math.PI/180;
 return [Math.cos(p)*Math.cos(t),Math.cos(p)*Math.sin(t),Math.sin(p)];
}
function angularCoords(v){return [normalizeLon(Math.atan2(v[1],v[0])*180/Math.PI),Math.atan2(v[2],Math.hypot(v[0],v[1]))*180/Math.PI];}
function onSegment(a,b,p){
 const dx=b[0]-a[0],dy=b[1]-a[1],vx=p[0]-a[0],vy=p[1]-a[1];
 return Math.abs(dx*vy-dy*vx)<=1e-12*Math.hypot(dx,dy) && vx*(p[0]-b[0])+vy*(p[1]-b[1])<=1e-12;
}
export function containsPlanar(poly,p){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[j],b=poly[i];
  if(onSegment(a,b,p))return true;
  if((a[1]>p[1])!==(b[1]>p[1])){
   const intersect=a[0]+(p[1]-a[1])*(b[0]-a[0])/(b[1]-a[1]);
   if(p[0]<intersect)inside=!inside;
  }
 }
 return inside;
}
function encode(root,path){
 if(!Number.isInteger(root)||root<0||root>=12||!Array.isArray(path)||path.length>10||path.some(d=>!Number.isInteger(d)||d<0||d>31))
  throw new RangeError('Invalid V5-64 address');
 let word=(1n<<60n)|(BigInt(path.length)<<56n)|(BigInt(root)<<50n);
 path.forEach((digit,i)=>{word|=BigInt(digit)<<BigInt(50-5*(i+1));});
 return '0x'+word.toString(16).padStart(16,'0');
}
export function decodeCell(id){
 if(typeof id!=='string'||!/^0x[0-9a-fA-F]{1,16}$/.test(id))throw new TypeError('Expected hexadecimal uint64 CellID');
 const word=BigInt(id);
 const version=Number((word>>60n)&15n),resolution=Number((word>>56n)&15n),root=Number((word>>50n)&63n);
 if(version!==1||resolution>10||root>=12)throw new RangeError('Invalid CellID header');
 const padding=50-5*resolution;
 if(padding&&(word&((1n<<BigInt(padding))-1n))!==0n)throw new RangeError('Noncanonical CellID padding');
 const path=Array.from({length:resolution},(_,i)=>Number((word>>BigInt(50-5*(i+1)))&31n));
 return {id:encode(root,path),root,resolution,path};
}
export function cellParent(id){
 const c=decodeCell(id);
 if(!c.resolution)throw new RangeError('Root has no parent');
 return encode(c.root,c.path.slice(0,-1));
}
export function cellChildren(id){
 const c=decodeCell(id);
 if(c.resolution===10)throw new RangeError('Max codec resolution');
 return Array.from({length:32},(_,digit)=>encode(c.root,[...c.path,digit]));
}
/** Latitude/longitude ANGLES projected onto a sphere; NOT WGS84 ellipsoid. */
export function latLngToCell(lat,lon,resolution=1){
 checkCoordinates(lat,lon);checkLevel(resolution);
 const v=unitVector(lat,lon);
 let root=0,max=-Infinity;
 for(let i=0;i<12;i++){
  const s=dot3(v,icoVertices[i]);
  if(s>max+1e-14){max=s;root=i;}
 }
 const a=ATLAS[root],scale=a.planeDistance/dot3(v,a.normal);
 const point=[scale*dot3(v,a.u),scale*dot3(v,a.v)];
 let polygon=a.polygon, path=[];
 for(let r=0;r<resolution;r++){
  let digit=0;
  for(let b=0;b<5;b++){
   const [left,right]=weakBinarySplit(polygon);
   const l=containsPlanar(left,point),rr=containsPlanar(right,point);
   if(!l&&!rr)throw new RangeError('Unstable lookup near weak cell boundary');
   const bit=l?0:1;
   digit=(digit<<1)|bit;
   polygon=bit?right:left;
  }
  path.push(digit);
 }
 return encode(root,path);
}
function polygonFor(c){
 checkLevel(c.resolution);
 let polygon=ATLAS[c.root].polygon;
 for(const digit of c.path){
  for(let bit=4;bit>=0;bit--){
   const [left,right]=weakBinarySplit(polygon);
   polygon=(digit&(1<<bit))?right:left;
  }
 }
 return polygon;
}
export function cellToBoundary(id){
 const c=decodeCell(id);
 return polygonFor(c).map(p=>angularCoords(liftToSphere(ATLAS[c.root],p)));
}
const orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
export function cellToPoint(id){
 const c=decodeCell(id),poly=polygonFor(c);
 for(let i=0;i<5;i++){
  const [a,b,d,e,f]=Array.from({length:5},(_,j)=>poly[(i+j)%5]);
  if(orient(a,b,d)>0&&orient(a,d,e)>0&&orient(a,e,f)>0){
   const p=[(a[0]+b[0]+d[0])/3,(a[1]+b[1]+d[1])/3];
   return angularCoords(liftToSphere(ATLAS[c.root],p));
  }
 }
 throw new RangeError('Cannot certify interior point');
}
export function rootNeighbors(id){
 const c=decodeCell(id);
 if(c.resolution!==0)throw new RangeError('Only root neighbors are currently supported');
 const s=new Set();
 for(const face of ICOSAHEDRON_FACES)if(face.includes(c.root))for(const v of face)if(v!==c.root)s.add(v);
 return [...s].sort((a,b)=>a-b).map(root=>encode(root,[]));
}
export function cellToGeoJSON(id){
 const c=decodeCell(id),vertices=cellToBoundary(id);
 return {type:'Feature',properties:{id:c.id,root:c.root,resolution:c.resolution,
   status:'experimental_weak_unit_sphere',antimeridianSplit:false},
  geometry:{type:'Polygon',coordinates:[[...vertices,vertices[0]]]}};
}
export function gridInfo(){
 return {rootCount:12,maxGeometryResolution:2,codecLevels:10,
  sphere:true,equalArea:false,edgeToEdge:false,ogcConformance:'not certified'};
}
