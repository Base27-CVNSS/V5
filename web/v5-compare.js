/* SPDX-License-Identifier: Apache-2.0
 V5 Compare Lab v1.0.0 — architectural counts only. Not performance benchmarks.
 H3 root count =122; S2=6; V5 roots=12 (research).
 H3 max resolution=15; S2 cell levels 0..30; V5-64 v1 =0..10.
 H3 aperture=7 with pentagon exceptions; S2=4; V5 weak=32.
*/
const data={
  roots:{values:[122,6,12],unit:"cells",en:"Resolution-0 base cells",vi:"Số ô cơ sở cấp 0",explainEN:"Different base cell counts are architectural facts, not a precision or speed ranking.",explainVI:"Số ô gốc là cấu trúc kiến trúc, không phải bảng xếp hạng độ chính xác hoặc tốc độ."},
  depth:{values:[15,30,10],unit:"levels",en:"Maximum ID resolution",vi:"Độ sâu CellID tối đa",explainEN:"Levels are not directly comparable: each system uses a different branching area and shape.",explainVI:"Không thể so trực tiếp cùng số cấp: diện tích, kiểu phân nhánh và độ biến dạng khác nhau."},
  branch:{values:[7,4,32],unit:"children",en:"Nominal refinement factor",vi:"Số nhánh phân cấp danh nghĩa",explainEN:"H3 uses aperture 7 (pentagon exception), S2 a four-child quadtree, and V5 an experimental 32-way WEAK construction.",explainVI:"H3 aperture 7 (ngoại lệ ô ngũ giác), S2 bốn con, V5 32 con trong phân hoạch YẾU thử nghiệm."},
  bits:{values:[64,64,64],unit:"bits",en:"Index width",vi:"Độ rộng CellID",explainEN:"All three use 64-bit spatial IDs. Bit width alone cannot prove a speed or accuracy advantage.",explainVI:"Cả ba dùng CellID 64-bit. Độ rộng số nguyên không chứng minh ưu thế tốc độ hoặc độ chính xác."}
};
const $=id=>document.getElementById(id);
const names=["H3","S2","V5"];
const colors=["linear-gradient(90deg,#50cedd,#2c96b6)","linear-gradient(90deg,#f1ab7d,#d069a5)","linear-gradient(90deg,#e051e3,#9854fc)"];
const statusRows=[
 {en:"WGS84 coordinate API",vi:"API tọa độ WGS84",vals:["yes","yes","open"]},
 {en:"64-bit spatial ID",vi:"Mã định danh 64-bit",vals:["yes","yes","yes"]},
 {en:"Parent/child hierarchy",vi:"Phân cấp cha/con",vals:["yes","yes","yes"]},
 {en:"Strict parent geometry nesting",vi:"Bao hàm hình học cha–con",vals:["limited","yes","limited"]},
 {en:"Region covering API",vi:"API bao phủ vùng",vals:["yes","yes","open"]},
 {en:"Pentagonal cells",vi:"Có ô ngũ giác",vals:["limited","na","limited"]},
 {en:"Exactly equal-area cells",vi:"Ô có diện tích bằng nhau tuyệt đối",vals:["na","na","open"]},
 {en:"Production-ready global grid",vi:"Lưới toàn cầu vận hành ổn định",vals:["yes","yes","open"]},
];
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
 for(const row of statusRows){
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
 const m=data[chosen];const max=Math.max(...m.values);
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
 const A=Number(control.value),R=6371,excess=(A/(R*R))*180/Math.PI;
 const angle=540+excess;
 $("v5-area-value").textContent=A.toLocaleString(language()==="vi"?"vi-VN":"en-US")+" km²";
 $("v5-angle-value").textContent=angle.toLocaleString(language()==="vi"?"vi-VN":"en-US",{minimumFractionDigits:3,maximumFractionDigits:3})+"°";
 $("v5-excess-value").textContent="+"+excess.toLocaleString(language()==="vi"?"vi-VN":"en-US",{minimumFractionDigits:3,maximumFractionDigits:3})+"°";
 const bar=$("v5-angle-indicator");
 if(bar)bar.style.width=Math.min(100,Math.max(0,(excess/(2000000/(R*R)*180/Math.PI))*100))+"%";
}
const metricButtons=document.querySelectorAll("[data-v5-metric]");
metricButtons.forEach(b=>b.addEventListener("click",()=>{
 metricButtons.forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
 bars();
}));
$("v5-area")?.addEventListener("input",curvature);
document.addEventListener("v5:language",()=>{bars();matrix();curvature()});
bars();matrix();curvature();
