/* SPDX-License-Identifier: Apache-2.0
   V5 bilingual overview UI · no external translation services · accessible controls.
   Deep technical documents keep their explicitly labeled language (EN spec / VI proof). */
const translations={
 "nav.overview":{en:"Overview",vi:"Tổng quan"},
 "nav.explorer":{en:"Explorer",vi:"Khám phá"},
 "nav.globe":{en:"3D Sphere",vi:"Mô phỏng 3D"},
 "nav.comparison":{en:"Compare",vi:"So sánh"},
 "nav.math":{en:"Mathematics",vi:"Toán học"},
 "nav.usecases":{en:"50 Use Cases",vi:"50 bài toán"},
 "nav.docs":{en:"Documentation",vi:"Đặc tả kỹ thuật"},
 "hero.eyebrow":{en:"Pentagonal Geospatial Indexing · V5-32",vi:"Hệ chỉ mục không gian ngũ giác · V5-32"},
 "hero.first":{en:"Five edges.",vi:"Năm cạnh."},
 "hero.thirtytwo":{en:"Thirty-two",vi:"Ba mươi hai"},
 "hero.branches":{en:"branches.",vi:"nhánh."},
 "hero.planet":{en:"One planet.",vi:"Một hành tinh."},
 "hero.lead":{en:"An open, proof-driven research project investigating recursively nested pentagonal partitions on the sphere, topology constraints, and hierarchical spatial identifiers.",vi:"Nghiên cứu mã nguồn mở dựa trên chứng minh toán học về phân hoạch ngũ giác cầu đệ quy, ràng buộc tôpô và định danh không gian phân cấp."},
 "hero.explore":{en:"Explore the 32-cell construction →",vi:"Khám phá mô hình phân chia 32 ô →"},
 "hero.compare":{en:"Explore H3 / S2 / V5 →",vi:"So sánh H3 / S2 / V5 →"},
 "hero.spec":{en:"Technical specification ↗",vi:"Đặc tả kỹ thuật ↗"},
 "hero.proof":{en:"Mathematical proof (VI)",vi:"Chứng minh toán học (VI)"},
 "hero.usecases":{en:"50 research use cases",vi:"50 bài toán nghiên cứu"},
 "overview.kicker":{en:"OVERVIEW / RESEARCH PROGRAM",vi:"TỔNG QUAN / CHƯƠNG TRÌNH NGHIÊN CỨU"},
 "overview.title":{en:"From planar existence to spherical structure.",vi:"Từ chứng minh trên mặt phẳng tới cấu trúc mặt cầu."},
 "explorer.kicker":{en:"INTERACTIVE LABORATORY",vi:"PHÒNG THÍ NGHIỆM TƯƠNG TÁC"},
 "explorer.title":{en:"Watch 1 pentagon become 32.",vi:"Quan sát một ngũ giác chia thành 32 ô."},
 "sim.title":{en:"Curvature is the constraint.",vi:"Độ cong chính là ràng buộc."},
 "math.kicker":{en:"MATHEMATICAL FOUNDATION",vi:"NỀN TẢNG TOÁN HỌC"},
 "math.title":{en:"Theorem. Proof. Limitations.",vi:"Định lý. Chứng minh. Giới hạn."},
 "release.title":{en:"Version 1.0.0 — Verified scope, documented limitations.",vi:"Phiên bản 1.0.0 — Phạm vi rõ ràng, công bố cả giới hạn."},
 "compare.kicker":{en:"INTERACTIVE RESEARCH MATRIX / VERIFIABLE METRICS",vi:"MA TRẬN NGHIÊN CỨU TƯƠNG TÁC / CHỈ SỐ KIỂM CHỨNG"},
 "compare.title":{en:"Three grids. Different strengths.",vi:"Ba hệ lưới. Ba thế mạnh khác nhau."},
 "compare.lead":{en:"Explore architectural differences between H3, S2 and experimental V5-32. These are not invented benchmark rankings. V5's strong convex, equal-area and worldwide geocoding claims remain unverified.",vi:"Khám phá khác biệt kiến trúc H3, S2 và V5-32 thử nghiệm. Đây không phải bảng xếp hạng hiệu năng. V5 chưa chứng minh lưới toàn lồi, đồng nhất diện tích và định vị toàn cầu."},
 "chart.depth":{en:"Depth",vi:"Độ sâu"},
 "chart.branch":{en:"Branching",vi:"Phân nhánh"},
 "chart.roots":{en:"Root cells",vi:"Ô gốc"},
 "chart.bits":{en:"Index bits",vi:"Số bit"},
 "matrix.title":{en:"Which capabilities actually exist?",vi:"Những năng lực nào thực sự đã có?"},
 "matrix.note":{en:"Evidence-oriented categorical statuses, not subjective numerical scores.",vi:"Đối chiếu trạng thái dựa trên bằng chứng, không chấm điểm chủ quan."},
 "matrix.capability":{en:"Capability",vi:"Năng lực"},
 "matrix.available":{en:"Implemented",vi:"Đã triển khai"},
 "matrix.limited":{en:"Conditional",vi:"Có giới hạn"},
 "matrix.research":{en:"Research",vi:"Đang nghiên cứu"},
 "matrix.caveat":{en:"Equal-area to zero error is NOT a verified V5 property. All three can use 64-bit keys; V5-64 v1 has 10 encoded levels.",vi:"Diện tích bằng nhau sai số 0% CHƯA được chứng minh cho V5. Cả ba dùng khóa 64-bit; V5-64 v1 chỉ mã hóa được 10 cấp."},
 "curvature.title":{en:"How positive curvature changes pentagon angles",vi:"Độ cong dương làm thay đổi góc ngũ giác thế nào?"},
 "curvature.desc":{en:"Move the hypothetical area of a convex geodesic spherical pentagon on a round Earth with R = 6,371 km. The formula gives its angle sum; the slider is not an equal-area V5 cell measurement.",vi:"Thay đổi diện tích giả định của ngũ giác trắc địa lồi trên mặt cầu bán kính R = 6.371 km. Công thức tính tổng góc; đây không phải phép đo ô V5 diện tích bằng nhau."},
 "curvature.area":{en:"Hypothetical spherical pentagon area",vi:"Diện tích ngũ giác cầu giả định"},
 "curvature.caveat":{en:"Spherical metric only; WGS84 ellipsoid requires its own geodesic area computation. The theorem is not a proof of a strong V5-32 DGGS.",vi:"Công thức theo metric cầu; ellipsoid WGS84 cần phép đo trắc địa riêng. Định lý không chứng minh V5-32 mạnh đã tồn tại."},
 "curvature.sum":{en:"Interior-angle sum",vi:"Tổng góc trong"},
 "curvature.excess":{en:"Spherical excess above 540°",vi:"Phần dư góc cầu so với 540°"},
 "curvature.proof":{en:"Read the complete Gauss–Bonnet proof →",vi:"Đọc chứng minh Gauss–Bonnet đầy đủ →"},
 "compare.disclaimer":{en:"These charts compare documented architecture and maturity, not measured speed. H3/S2 are mature geospatial libraries; V5-32 remains a research reference. No synthetic advantage ratings are used.",vi:"Biểu đồ thể hiện đặc tính kiến trúc và độ trưởng thành, không phải tốc độ được đo. H3/S2 đã có thư viện GIS ổn định; V5-32 vẫn là mô hình nghiên cứu. Không dùng điểm lợi thế giả lập."}
};
const $=s=>document.querySelector(s);
const currentPage=document.body?.dataset.v5Page;
const root=document.documentElement;
let lang="en";
try{const saved=window.localStorage.getItem("v5-lang");if(saved==="en"||saved==="vi")lang=saved}catch{}
const urlLang=new URLSearchParams(window.location.search).get("lang");
if(urlLang==="en"||urlLang==="vi")lang=urlLang;
function setLang(next){
 if(next!=="en"&&next!=="vi")return;
 lang=next;root.lang=next;
 document.querySelectorAll("[data-v5-t]").forEach(node=>{
  const item=translations[node.dataset.v5T];
  if(item)node.textContent=item[next];
 });
 document.querySelectorAll("[data-v5-lang]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v5Lang===next)));
 try{window.localStorage.setItem("v5-lang",next)}catch{}
 document.dispatchEvent(new Event("v5:language"));
}
if(currentPage==="home"){
 document.querySelectorAll("[data-v5-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.v5Lang)));
 const toggle=$("#v5-nav-toggle"),header=document.querySelector("body.v5-home header");
 if(toggle&&header){
  toggle.addEventListener("click",()=>{
   const opened=header.getAttribute("data-menu-open")==="true";
   header.setAttribute("data-menu-open",String(!opened));
   toggle.setAttribute("aria-expanded",String(!opened));
   toggle.textContent=opened?"☰":"✕";
  });
  document.querySelectorAll("#v5-main-nav a").forEach(link=>link.addEventListener("click",()=>{
   header.setAttribute("data-menu-open","false");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰";
  }));
  document.addEventListener("keydown",e=>{
   if(e.key==="Escape"){header.setAttribute("data-menu-open","false");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰";}
  });
 }
 setLang(lang);
}
