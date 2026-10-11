/* SPDX-License-Identifier: Apache-2.0
 V5 Compare Lab v1.0.0 — architectural counts only. Not performance benchmarks.
 H3 root count =122; S2=6; V5 roots=12 (research).
 H3 max resolution=15; S2 cell levels 0..30; V5-64 v1 =0..10.
 H3 aperture=7 with pentagon exceptions; S2=4; V5 weak=32.
*/
import {gridMetrics, matrixRows, sphericalPentagonAngles} from "./v5-metrics.js";
const $=id=>document.getElementById(id);
const names=["H3","S2","V5"];
const colors=["linear-gradient(90deg,#50cedd,#2c96b6)","linear-gradient(90deg,#f1ab7d,#d069a5)","linear-gradient(90deg,#e051e3,#9854fc)"];
function language(){return document.documentElement.lang==="vi"?"vi":"en"}
function label(x){return x[language()]}
function matrix(){
 const root=$("v5-matrix-body");
 if(!root)return;
 root.replaceChildren();
 const labels={
  en:{yes:"Available",limited:"Limited",open:"Research",na:"No / N/A"},
  vi:{yes:"Đã có",limited:"Giới hạn",open:"Đang NC",na:"Không / —"}
 };
 for(const row of matrixRows){
  const tr=document.createElement("tr"), th=document.createElement("th");
  th.scope="row";th.textContent=label(row);tr.appendChild(th);
  row.vals.forEach(x=>{
   const td=document.createElement("td");
   td.className="v5-cell-"+x;
   td.textContent=labels[language()][x];tr.appendChild(td);
  });
  root.appendChild(tr);
 }
}
function bars(){
 const controls=document.querySelectorAll("[data-v5-metric]");
 if(!controls.length)return;
 const chosen=document.querySelector('[data-v5-metric][aria-pressed="true"]')?.dataset.v5Metric||"depth";
 const m=gridMetrics[chosen];const max=Math.max(...m.values);
 $("v5-chart-title").textContent=label(m);
 $("v5-chart-description").textContent=language()==="vi"?"So sánh dữ kiện kiến trúc, không phải kết quả benchmark.":"Comparative architecture, not a performance benchmark.";
 $("v5-chart-note").textContent=label({en:m.explainEN,vi:m.explainVI});
 const parent=$("v5-bars");parent.replaceChildren();
 m.values.forEach((value,i)=>{
  const row=document.createElement("div");row.className="v5-bar-row";
  const nm=document.createElement("span");nm.className="v5-bar-name";nm.textContent=names[i];
  const track=document.createElement("div");track.className="v5-bar-track";track.setAttribute("role","img");
  track.setAttribute("aria-label",names[i]+": "+value+" "+m.unit);
  const fill=document.createElement("span");fill.className="v5-bar-fill";
  fill.style.setProperty("--v5-pct",(value/max*100)+"%");
  fill.style.setProperty("--v5-color",colors[i]);track.appendChild(fill);
  const num=document.createElement("span");num.className="v5-bar-value";num.textContent=value.toString();
  row.append(nm,track,num);parent.appendChild(row);
 });
}
function curvature(){
 const control=$("v5-area");
 if(!control)return;
 const A=Number(control.value),{excessDegrees:excess,angleSumDegrees:angle}=sphericalPentagonAngles(A);
 $("v5-area-value").textContent=A.toLocaleString(language()==="vi"?"vi-VN":"en-US")+" km²";
 $("v5-gb-angle-value").textContent=angle.toLocaleString(language()==="vi"?"vi-VN":"en-US",{minimumFractionDigits:3,maximumFractionDigits:3})+"°";
 $("v5-excess-value").textContent="+"+excess.toLocaleString(language()==="vi"?"vi-VN":"en-US",{minimumFractionDigits:3,maximumFractionDigits:3})+"°";
 const bar=$("v5-angle-indicator");
 if(bar)bar.style.width=Math.min(100,Math.max(0,(excess/(sphericalPentagonAngles(2000000).excessDegrees))*100))+"%";
}
const metricButtons=document.querySelectorAll("[data-v5-metric]");
metricButtons.forEach(b=>b.addEventListener("click",()=>{
 metricButtons.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
 bars();
}));
$("v5-area")?.addEventListener("input",curvature);
document.addEventListener("v5:language",()=>{bars();matrix();curvature()});
bars();matrix();curvature();
