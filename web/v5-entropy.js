// SPDX-License-Identifier: Apache-2.0
// V5 entropy capacity calculator; NOT measured data entropy or cryptography.
export function capacityStats(branches, depth, digitBits) {
  if(!Number.isSafeInteger(branches)||branches<2||!Number.isSafeInteger(depth)||
     depth<1||depth>32||!Number.isSafeInteger(digitBits)||digitBits<1||
     digitBits>32||Math.pow(2,digitBits)<branches) {
    throw new RangeError('Invalid branch count/depth/digit bit width');
  }
  const allocated=depth*digitBits;
  const information=depth*Math.log2(branches);
  const minimum=Math.ceil(information-1e-12);
  return {
    branches,depth,digitBits,allocated,
    information,
    capacityEfficiency:information/allocated,
    theoreticalOverhead:allocated-information,
    denseBits:minimum,
    reclaimableIntegerBits:allocated-minimum,
    possiblePaths:BigInt(branches)**BigInt(depth)
  };
}
