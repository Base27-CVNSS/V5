// SPDX-License-Identifier: Apache-2.0
// V5 Research Reference 1.0.0: pure educational helpers, no GIS geometry.
export function encodeV564(root,path,version=1){
  if(!Number.isSafeInteger(root)||root<0||root>11||
     !Array.isArray(path)||path.length>10||
     path.some(d=>!Number.isSafeInteger(d)||d<0||d>31)||
     version!==1)
    throw new RangeError('V5-64 v1 requires root 0..11, path <=10 digits 0..31, version 1');
  let word=(1n<<60n)|(BigInt(path.length)<<56n)|(BigInt(root)<<50n);
  path.forEach((d,i)=>{word|=BigInt(d)<<BigInt(45-5*i)});
  return '0x'+word.toString(16).padStart(16,'0');
}

export function weightedMean(rows){
  if(!Array.isArray(rows)||rows.length===0)
    throw new RangeError('At least one area-value pair required');
  let total=0,weighted=0;
  for(const row of rows){
    if(!Number.isFinite(row.area)||!Number.isFinite(row.val)||row.area<0)
      throw new RangeError('Area must be nonnegative and values finite');
    total+=row.area;weighted+=row.area*row.val;
  }
  if(total<=0||!Number.isFinite(total)||!Number.isFinite(weighted))
    throw new RangeError('Total weighted area must be positive and finite');
  return weighted/total;
}

export function hierarchyAtResolution(res,earthSurfaceKm2=510065621.724){
  if(!Number.isSafeInteger(res)||res<0||res>10||
     !Number.isFinite(earthSurfaceKm2)||earthSurfaceKm2<=0)
    throw new RangeError('Resolution 0..10 and positive finite area required');
  const count=12n*(32n**BigInt(res));
  return {resolution:res,count,pathBits:5*res,meanAreaKm2:earthSurfaceKm2/Number(count)};
}
