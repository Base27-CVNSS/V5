// SPDX-License-Identifier: Apache-2.0
// Long Ngo 2026 · Vietflexmap Copyright (c) 2025
// Three.js WebGL research visualization — not an operational WGS84 DGGS.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  PI, TAU, clamp, degrees, dot3, add3, mul3, unit3,
  makeDodecahedralAtlas, liftToSphere, weak32,
  geodesicPentagonMetrics, vertexJunctions, greatCircleArc,
  latitudeRingMismatch
} from "./v5-sphere-math.js";

const el=id=>document.getElementById(id);
const stage=el("v5-globe-stage");
const caption=el("v5-3d-caption");
if (!stage) throw new Error("V5 3D stage missing");
const atlas=makeDodecahedralAtlas();
const junctions=vertexJunctions(atlas);
const scene=new THREE.Scene();
scene.background=new THREE.Color("#0a0612");
scene.fog=new THREE.FogExp2("#0a0612",0.045);
const camera=new THREE.PerspectiveCamera(42,1,0.03,140);
camera.position.set(2.65,1.65,3.45);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<780?1.4:1.8));
renderer.outputColorSpace=THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);
renderer.domElement.setAttribute("aria-label","Interactive 3D sphere with twelve pentagonal regions. Drag to rotate, scroll to zoom, click a face to inspect.");
renderer.domElement.setAttribute("role","img");
const orbit=new OrbitControls(camera,renderer.domElement);
orbit.enablePan=false;
orbit.enableDamping=true;
orbit.dampingFactor=.055;
orbit.minDistance=1.65;
orbit.maxDistance=8;
orbit.autoRotate=!(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
orbit.autoRotateSpeed=.38;
scene.add(new THREE.HemisphereLight(0xf8aaff,0x14091e,2.1));
const light=new THREE.DirectionalLight(0xffb4f0,2.4);
light.position.set(-2,3,4);
scene.add(light);
const atmosphere=new THREE.Mesh(
  new THREE.SphereGeometry(1.047,64,40),
  new THREE.MeshBasicMaterial({color:0xba50d9,transparent:true,opacity:.085,depthWrite:false,side:THREE.BackSide})
);
scene.add(atmosphere);
const ocean=new THREE.Mesh(
  new THREE.SphereGeometry(.992,100,64),
  new THREE.MeshPhongMaterial({color:0x32124e,emissive:0x180827,shininess:105,transparent:false})
);
scene.add(ocean);

const faceMeshes=[];
const palette=["#c85add","#f376dd","#985deb","#6b76eb","#c35ccf","#9353d9","#a064ed","#dd62c2","#8875dd","#b964ef","#bc71d9","#ec74c7"];
const rootGroup=new THREE.Group();
scene.add(rootGroup);
function lerp2(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
function gridPoint(a,b,c,i,j,n){
  const fi=i/n,fj=j/n;
  return [a[0]*(1-fi-fj)+b[0]*fi+c[0]*fj,
          a[1]*(1-fi-fj)+b[1]*fi+c[1]*fj];
}
function rootPatchGeometry(root,subdivisions=10){
  // A triangular fan inside the planar convex root, finely subdivided
  // BEFORE radial projection. This creates curved spherical patches.
  const p=root.polygon;
  const center=p.reduce((q,v)=>[q[0]+v[0]/5,q[1]+v[1]/5],[0,0]);
  const positions=[];
  function triangle(a,b,c) {
    for(const v of [a,b,c]) positions.push(...mul3(liftToSphere(root,v),1.001));
  }
  for(let side=0;side<5;side++){
    const a=center,b=p[side],c=p[(side+1)%5];
    for(let i=0;i<subdivisions;i++){
      for(let j=0;j<subdivisions-i;j++){
        const p0=gridPoint(a,b,c,i,j,subdivisions);
        const p1=gridPoint(a,b,c,i+1,j,subdivisions);
        const p2=gridPoint(a,b,c,i,j+1,subdivisions);
        triangle(p0,p1,p2);
        if(i+j+1<subdivisions){
          const p3=gridPoint(a,b,c,i+1,j+1,subdivisions);
          triangle(p1,p3,p2);
        }
      }
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
  g.computeVertexNormals();
  return g;
}
atlas.forEach((root,i)=>{
  const material=new THREE.MeshPhongMaterial({
    color:new THREE.Color(palette[i]),side:THREE.DoubleSide,
    shininess:60,emissive:0x061d2e,flatShading:false
  });
  const mesh=new THREE.Mesh(rootPatchGeometry(root),material);
  mesh.userData.root=i;
  rootGroup.add(mesh);
  faceMeshes.push(mesh);
});

const borderGroup=new THREE.Group();
scene.add(borderGroup);
let currentLines=null;
const highlightLineMaterial=new THREE.LineBasicMaterial({color:0xffca65,transparent:true,opacity:.94});
let highlightLines=null;
function lineMesh(paths,color,opacity=1,segments=5){
  const points=[];
  for(const path of paths){
    for(let i=0;i<path.length;i++){
      const a=path[i],b=path[(i+1)%path.length];
      const arc=greatCircleArc(a,b,segments,1.012);
      for(let j=0;j<arc.length-1;j++) points.push(...arc[j],...arc[j+1]);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
  return new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity,depthTest:true}));
}
function disposeLines(object){
  if(!object)return;
  object.geometry.dispose();object.material.dispose();
  borderGroup.remove(object);
}
const outlinePaths=atlas.map(root=>root.vertices);
const rootOutlines=lineMesh(outlinePaths,0xa8f2ee,.85,16);
borderGroup.add(rootOutlines);
const verticesGroup=new THREE.Group();
scene.add(verticesGroup);
const vertexMarkers=[];
junctions.forEach((vertex,i)=>{
  const marker=new THREE.Mesh(new THREE.SphereGeometry(.017,10,8),
    new THREE.MeshBasicMaterial({color:0xffe2a4,depthTest:true}));
  marker.position.set(...mul3(vertex.position,1.024));
  marker.userData.vertex=i;
  verticesGroup.add(marker);
  vertexMarkers.push(marker);
});
const ringGroup=new THREE.Group();
scene.add(ringGroup);
function ringLine(theta,color){
  const vertices=[];
  const size=160;
  for(let k=0;k<size;k++){
    const t=TAU*k/size;
    vertices.push([1.035*Math.sin(theta)*Math.cos(t),1.035*Math.cos(theta),1.035*Math.sin(theta)*Math.sin(t)]);
  }
  return lineMesh([vertices],color,.93,1);
}
function clearRing(){
  while(ringGroup.children.length){
    const item=ringGroup.children[0];
    ringGroup.remove(item);
    item.geometry.dispose();item.material.dispose();
  }
}
let selectedRoot=0,selectedVertex=0,level="roots",mode="angles";
function setFaceSelection(i){
  selectedRoot=i;
  faceMeshes.forEach((m,j)=>{
    m.material.emissive.setHex(j===i?0x195473:0x061d2e);
    m.material.color.set(j===i?"#6edbd7":palette[j]);
  });
  const selected=atlas[i];
  if(highlightLines){disposeLines(highlightLines);highlightLines=null;}
  highlightLines=lineMesh([selected.vertices],0xffd175,1,22);
  borderGroup.add(highlightLines);
  const metrics=geodesicPentagonMetrics(selected);
  el("v5-selected-face").textContent="Root pentagon "+String(i+1).padStart(2,"0")+" / 12";
  el("v5-angle-value").textContent=metrics.degrees.map(v=>v.toFixed(1)+"°").join(" · ");
  el("v5-angle-sum").textContent=degrees(metrics.sum).toFixed(3)+"°";
  el("v5-excess").textContent=metrics.excess.toFixed(9)+" sr";
  el("v5-cell-area").textContent=(100*metrics.areaFraction).toFixed(5)+"% of sphere";
  el("v5-angle-check").textContent=Math.abs(metrics.excess-PI/3)<1e-7?"PASS · Σα = 600° > 540°":"CHECK GEOMETRY";
  if(level==="selected2") refreshGrid();
}
function setVertexSelection(i){
  selectedVertex=i;
  vertexMarkers.forEach((m,j)=>m.scale.setScalar(j===i?1.7:1));
  const item=junctions[i];
  el("v5-vertex-name").textContent="Vertex "+String(i+1).padStart(2,"0")+" / 20";
  el("v5-vertex-angles").textContent=item.incident.map(e=>"F"+(e.face+1)+": "+degrees(e.angle).toFixed(3)+"°").join(" + ");
  el("v5-vertex-sum").textContent=degrees(item.angleSum).toFixed(8)+"°";
  el("v5-vertex-residual").textContent=Math.abs(degrees(item.residual)).toExponential(2)+"°";
}
const subdivisionCache=new Map();
function cellsForFace(rootIndex,depth){
  const key=rootIndex+":"+depth;
  if(subdivisionCache.has(key))return subdivisionCache.get(key);
  let result=[atlas[rootIndex].polygon];
  for(let k=0;k<depth;k++)result=result.flatMap(weak32);
  subdivisionCache.set(key,result);
  return result;
}
function refreshGrid(){
  disposeLines(currentLines);currentLines=null;
  if(level==="global1"){
    const paths=[];
    atlas.forEach((root,i)=>cellsForFace(i,1).forEach(poly=>paths.push(poly.map(pt=>liftToSphere(root,pt)))));
    currentLines=lineMesh(paths,0x75f2e5,.58,4);
    borderGroup.add(currentLines);
    caption.textContent="r = 1 · 384 visible weak pentagons (32 per root) · concave cells and hanging nodes permitted";
  } else if(level==="selected2"){
    const root=atlas[selectedRoot];
    const paths=cellsForFace(selectedRoot,2).map(poly=>poly.map(pt=>liftToSphere(root,pt)));
    currentLines=lineMesh(paths,0x75f2e5,.8,3);
    borderGroup.add(currentLines);
    caption.textContent="r = 2 · showing 1,024 weak cells inside selected root; 12,288 cells globally (not all drawn)";
  }else{
    caption.textContent="r = 0 · 12 geodesic pentagonal roots · 20 vertices · 3 × 120° = 360°";
  }
  el("v5-global-cells").textContent=level==="roots"?"12":level==="global1"?"384":"12,288";
  el("v5-drawn-cells").textContent=level==="roots"?"12":level==="global1"?"384":"1,024";
}
function updateSimilarity(){
  const lambda=Number(el("v5-lambda").value)/100;
  const theta=Number(el("v5-theta").value)*PI/180;
  const data=latitudeRingMismatch(lambda,theta);
  const mismatch=100*data.fractionalMismatch;
  el("v5-lambda-val").textContent=lambda.toFixed(2);
  el("v5-theta-val").textContent=degrees(theta).toFixed(0)+"°";
  el("v5-ring-actual").textContent=data.actualCircumference.toFixed(5)+" R";
  el("v5-ring-similar").textContent=data.hypotheticalSimilarityCircumference.toFixed(5)+" R";
  el("v5-ring-error").textContent=(mismatch>=0?"+":"")+mismatch.toFixed(3)+"%";
  el("v5-ring-ratio").style.width=Math.min(100,100/(1+Math.max(0,data.fractionalMismatch))).toFixed(3)+"%";
  clearRing();
  ringGroup.add(ringLine(theta,0xffffff),ringLine(lambda*theta,0xf5b958));
}
function changeMode(next){
  mode=next;
  verticesGroup.visible=mode==="vertices";
  ringGroup.visible=mode==="similarity";
  for(const name of ["angles","vertices","similarity"]){
    const button=el("v5-mode-"+name);
    button.setAttribute("aria-pressed",String(mode===name));
    button.classList.toggle("active",mode===name);
  }
  for(const name of ["angles","vertices","similarity"]){
    el("v5-panel-"+name).hidden=(mode!==name);
  }
  el("v5-3d-mode-label").textContent=mode==="angles"?"Spherical excess / local geometry":mode==="vertices"?"Vertex closure / 2π":"No global similarity / λ < 1";
}
function onResize(){
  const w=Math.max(stage.clientWidth,260),h=Math.max(stage.clientHeight,340);
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
}
const observer=new ResizeObserver(onResize);observer.observe(stage);onResize();
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let pointerDown=null;
renderer.domElement.addEventListener("pointerdown",e=>{pointerDown={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener("pointerup",e=>{
  if(!pointerDown||Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>7){pointerDown=null;return;}
  pointerDown=null;
  const bounds=renderer.domElement.getBoundingClientRect();
  pointer.set((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1);
  raycaster.setFromCamera(pointer,camera);
  if(mode==="vertices"){
    const hits=raycaster.intersectObjects(vertexMarkers,false);
    if(hits.length){setVertexSelection(hits[0].object.userData.vertex);return;}
  }
  const hits=raycaster.intersectObjects(faceMeshes,false);
  if(hits.length)setFaceSelection(hits[0].object.userData.root);
});
el("v5-depth").addEventListener("change",e=>{
  level=e.target.value;refreshGrid();if(level==="selected2")setFaceSelection(selectedRoot);
});
for(const name of ["angles","vertices","similarity"]){
  el("v5-mode-"+name).addEventListener("click",()=>changeMode(name));
}
el("v5-auto-rotate").addEventListener("change",e=>{orbit.autoRotate=e.target.checked;});
el("v5-visible-edges").addEventListener("change",e=>{borderGroup.visible=e.target.checked;});
el("v5-reset-camera").addEventListener("click",()=>{
  camera.position.set(2.65,1.65,3.45);orbit.target.set(0,0,0);orbit.update();
});
el("v5-lambda").addEventListener("input",updateSimilarity);
el("v5-theta").addEventListener("input",updateSimilarity);
el("v5-next-vertex").addEventListener("click",()=>setVertexSelection((selectedVertex+1)%junctions.length));
el("v5-next-face").addEventListener("click",()=>setFaceSelection((selectedRoot+1)%atlas.length));
const starGeometry=new THREE.BufferGeometry(),stars=[];
let seed=42;
function rng(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let i=0;i<240;i++){
  const v=unit3([rng()-.5,rng()-.5,rng()-.5]),distance=12+rng()*20;
  stars.push(...mul3(v,distance));
}
starGeometry.setAttribute("position",new THREE.Float32BufferAttribute(stars,3));
const starfield=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xe39aff,size:.038,transparent:true,opacity:.65,depthWrite:false}));
scene.add(starfield);
setFaceSelection(0);
setVertexSelection(0);
refreshGrid();
updateSimilarity();
changeMode("angles");
el("v5-3d-ready").textContent="WebGL · Three.js · 12 spherical roots";
el("v5-3d-ready").classList.add("ready");
if(el("v5-3d-loading"))el("v5-3d-loading").remove();
function animate(){
  requestAnimationFrame(animate);
  if(!document.hidden){orbit.update();renderer.render(scene,camera);}
}
animate();
