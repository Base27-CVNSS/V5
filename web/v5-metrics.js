// SPDX-License-Identifier: Apache-2.0
// Research-only mathematical comparisons. These are ARCHITECTURE facts, not performance.
export const gridMetrics=Object.freeze({
 roots:Object.freeze({values:Object.freeze([122,6,12]),unit:"cells",en:"Resolution-0 base cells",vi:"Số ô cơ sở cấp 0",explainEN:"Different base cell counts are architectural facts, not a precision or speed ranking.",explainVI:"Số ô gốc là cấu trúc kiến trúc, không phải bảng xếp hạng độ chính xác hoặc tốc độ."}),
 depth:Object.freeze({values:Object.freeze([15,30,10]),unit:"levels",en:"Maximum ID resolution",vi:"Độ sâu CellID tối đa",explainEN:"Levels are not directly comparable: each system uses a different branching area and shape.",explainVI:"Không thể so trực tiếp cùng số cấp: diện tích, kiểu phân nhánh và độ biến dạng khác nhau."}),
 branch:Object.freeze({values:Object.freeze([7,4,32]),unit:"children",en:"Nominal refinement factor",vi:"Số nhánh phân cấp danh nghĩa",explainEN:"H3 uses aperture 7 (pentagon exception), S2 a four-child quadtree, and V5 an experimental 32-way WEAK construction.",explainVI:"H3 aperture 7 (ngoại lệ ô ngũ giác), S2 bốn con, V5 32 con trong phân hoạch YẾU thử nghiệm."}),
 bits:Object.freeze({values:Object.freeze([64,64,64]),unit:"bits",en:"Index width",vi:"Độ rộng CellID",explainEN:"All three use 64-bit spatial IDs. Bit width alone cannot prove a speed or accuracy advantage.",explainVI:"Cả ba dùng CellID 64-bit. Độ rộng số nguyên không chứng minh ưu thế tốc độ hoặc độ chính xác."})
});
export const matrixRows=Object.freeze([
 {en:"WGS84 coordinate API",vi:"API tọa độ WGS84",vals:["yes","yes","open"]},
 {en:"64-bit spatial ID",vi:"Mã định danh 64-bit",vals:["yes","yes","yes"]},
 {en:"Parent/child hierarchy",vi:"Phân cấp cha/con",vals:["yes","yes","yes"]},
 {en:"Strict parent geometry nesting",vi:"Bao hàm hình học cha–con",vals:["limited","yes","limited"]},
 {en:"Region covering API",vi:"API bao phủ vùng",vals:["yes","yes","open"]},
 {en:"Pentagonal cells",vi:"Có ô ngũ giác",vals:["limited","na","limited"]},
 {en:"Exactly equal-area cells",vi:"Ô có diện tích bằng nhau tuyệt đối",vals:["na","na","open"]},
 {en:"Production-ready global grid",vi:"Lưới toàn cầu vận hành ổn định",vals:["yes","yes","open"]},
]);
export function sphericalPentagonAngles(areaKm2,radiusKm=6371){
 if(!Number.isFinite(areaKm2)||areaKm2<=0||!Number.isFinite(radiusKm)||radiusKm<=0||areaKm2>=2*Math.PI*radiusKm**2)throw new RangeError("Convex hemisphere pentagon area and radius must be positive finite values");
 const excessRadians=areaKm2/(radiusKm**2);
 return {excessRadians,excessDegrees:excessRadians*180/Math.PI,angleSumDegrees:540+excessRadians*180/Math.PI};
}
export function theoreticalCellCount(level){
 if(!Number.isSafeInteger(level)||level<0||level>10)throw new RangeError("V5-64 v1 supports 0..10 levels");
 return 12n*(32n**BigInt(level));
}
