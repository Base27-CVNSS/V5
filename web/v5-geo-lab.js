// SPDX-License-Identifier: Apache-2.0
import {latLngToCell,cellToGeoJSON,cellToPoint,decodeCell} from './v5-geo.js';
const el=x=>document.getElementById(x);
let current='',geo=null;
function update(){
 const lat=Number(el('lat').value),lon=Number(el('lon').value),res=Number(el('res').value);
 if(!Number.isFinite(lat)||!Number.isFinite(lon))throw new RangeError('Coordinates must be finite.');
 current=latLngToCell(lat,lon,res);
 geo=cellToGeoJSON(current);
 const c=decodeCell(current),inside=cellToPoint(current);
 el('cell-id').textContent=JSON.stringify(c,null,2);
 el('json').textContent=JSON.stringify(geo,null,2);
 const points=geo.geometry.coordinates[0].slice(0,-1);
 const unwrap=lon=>inside[0]+((lon-inside[0]+540)%360)-180;
 const xs=points.map(p=>unwrap(p[0])),ys=points.map(p=>p[1]);
 const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
 const scale=Math.min(500/Math.max(1e-9,xmax-xmin),310/Math.max(1e-9,ymax-ymin));
 const cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
 el('polygon').setAttribute('points',points.map((_,i)=>
   [300+(xs[i]-cx)*scale,200-(ys[i]-cy)*scale].join(',')).join(' '));
 el('center').textContent='Interior sample: lon '+inside[0].toFixed(6)+'°, lat '+inside[1].toFixed(6)+'°. Local diagram is schematic, not a map projection.';
 el('error').textContent='';
}
function safeUpdate(){try{update()}catch(e){el('error').textContent=String(e.message||e);}}
el('geo-form').addEventListener('submit',event=>{event.preventDefault();safeUpdate();});
el('reset').addEventListener('click',()=>{el('lat').value='10.7769';el('lon').value='106.7009';el('res').value='1';safeUpdate();});
el('copy').addEventListener('click',async()=>{
 if(!current)return;
 try{await navigator.clipboard.writeText(current);}catch{el('error').textContent='Copy unavailable. Select the CellID in the text panel.';}
});
el('export').addEventListener('click',()=>{
 if(!geo)return;
 const url=URL.createObjectURL(new Blob([JSON.stringify(geo,null,2)],{type:'application/geo+json'}));
 const a=document.createElement('a');a.href=url;a.download='v5-experimental-'+current.slice(2)+'.geojson';
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
safeUpdate();
