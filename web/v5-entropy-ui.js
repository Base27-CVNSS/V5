// SPDX-License-Identifier: Apache-2.0
// Capacity-only visualization: code efficiency, not Shannon entropy measurements.
import {capacityStats} from './v5-entropy.js';
const el=id=>document.getElementById(id);
const slider=el('dna-depth');
if(slider){
  function draw(){
    const n=Number(slider.value);
    const old=capacityStats(5,n,3), live=capacityStats(32,10,5);
    el('dna-depth-value').textContent=n;
    el('dna-alloc').textContent=old.allocated+' bit';
    el('dna-info').textContent=old.information.toLocaleString('vi-VN',{maximumFractionDigits:3})+' bit';
    el('dna-min').textContent=old.denseBits+' bit';
    el('dna-reclaim').textContent=old.reclaimableIntegerBits+' bit';
    el('dna-eff').textContent=(old.capacityEfficiency*100).toFixed(1)+'%';
    el('dna-waste').textContent=((1-old.capacityEfficiency)*100).toFixed(1)+'%';
    el('dna-live').textContent=(live.capacityEfficiency*100).toFixed(0)+'%';
    el('dna-bar-used').style.width=(old.capacityEfficiency*100).toFixed(2)+'%';
  }
  slider.addEventListener('input',draw);
  draw();
}
