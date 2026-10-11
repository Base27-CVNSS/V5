// SPDX-License-Identifier: Apache-2.0
// V5 Research Reference v1.0.0 — UI-only examples, not an operational DGGS.
import {categories, useCases, gates} from './v5-usecases-data.js';
const $=id=>document.getElementById(id);
const fmt=n=>Number(n).toLocaleString('vi-VN',{maximumFractionDigits:3});
const el=(tag,cls,text)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(text!==undefined)node.textContent=text;
  return node;
};
const state={category:'all',status:'all',query:''};
const list=$('catalog-list'),filterBox=$('catalog-filters'),shown=$('shown-count');

function card(item){
  const details=el('details','case-card');
  details.id='case-'+item.id;
  const summary=el('summary','case-top');
  const lead=el('span','case-lead');
  lead.append(el('span','case-no','#'+String(item.id).padStart(2,'0')),
              el('strong','case-name',item.title));
  const right=el('span','case-right');
  right.append(el('span','case-category',categories.find(x=>x.id===item.category).label),
               el('span','case-expand','Xem chi tiết'));
  summary.append(lead,right);
  const meta=el('div','case-meta');
  const status=el('span','status status-'+item.status,gates[item.status].label);
  meta.append(status);
  const body=el('div','case-content');
  const fields=[
    ['Dữ liệu đầu vào',item.input],
    ['Phương án thử nghiệm',item.method],
    ['Vì sao nghiên cứu V5?',item.hypothesis],
    ['Điều kiện bắt buộc',item.gate],
    ['Chỉ số kiểm chứng',item.metric]
  ];
  for(const [label,value] of fields){
    const line=el('div','case-field');
    line.append(el('b','',label),el('p','',value));
    body.append(line);
  }
  const note=el('p','stage-note','Mức sẵn sàng: '+gates[item.status].desc);
  body.append(note);
  details.append(summary,meta,body);
  return details;
}
function refresh(){
  const normalized=state.query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const matches=useCases.filter(item=>{
    if(state.category!=='all'&&item.category!==state.category)return false;
    if(state.status!=='all'&&item.status!==state.status)return false;
    const search=[item.id,item.title,item.input,item.method,item.hypothesis,item.gate,item.metric].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return search.includes(normalized);
  });
  list.replaceChildren(...matches.map(card));
  if(!matches.length)list.append(el('p','empty','Không tìm được bài toán phù hợp. Hãy xóa bộ lọc để xem đủ 50 bài toán.'));
  shown.textContent=fmt(matches.length)+' / 50 bài toán';
}
function setup(){
  const buttons=[{id:'all',label:'Tất cả (50)'},...categories];
  for(const item of buttons){
    const btn=el('button','filter',item.label);
    btn.type='button';
    btn.setAttribute('aria-pressed',String(item.id===state.category));
    btn.addEventListener('click',()=>{
      state.category=item.id;
      filterBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
      refresh();
    });
    filterBox.append(btn);
  }
  $('case-search').addEventListener('input',e=>{state.query=e.target.value||'';refresh()});
  $('status-select').addEventListener('change',e=>{state.status=e.target.value;refresh()});
  $('clear-filters').addEventListener('click',()=>{
    state.category='all';state.status='all';state.query='';
    $('case-search').value='';$('status-select').value='all';
    filterBox.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));
    refresh();
  });
  refresh();
}
setup();

function canonical(root,path){
  if(!Number.isSafeInteger(root)||root<0||root>11||path.length>10||
      path.some(x=>!Number.isSafeInteger(x)||x<0||x>31))
    throw new RangeError('root 0–11, tối đa 10 digits, digit 0–31');
  let word=(1n<<60n)|(BigInt(path.length)<<56n)|(BigInt(root)<<50n);
  path.forEach((d,i)=>word|=BigInt(d)<<BigInt(45-5*i));
  return '0x'+word.toString(16).padStart(16,'0');
}
function inspectId(){
  const rootRaw=$('lab-root').value.trim(),pathRaw=$('lab-path').value.trim();
  const parts=pathRaw?pathRaw.split(',').map(s=>s.trim()):[];
  const isUInt=s=>/^(0|[1-9]\d*)$/.test(s);
  try{
    if(!isUInt(rootRaw)||parts.some(s=>!isUInt(s)))throw new Error('Chỉ nhập số nguyên không dấu, phân tách bằng dấu phẩy.');
    const root=Number(rootRaw),path=parts.map(Number);
    const hex=canonical(root,path),parent=path.length?canonical(root,path.slice(0,-1)):'Không có (root)';
    $('lab-id').textContent=hex;
    $('lab-parent').textContent='Parent: '+parent+' · Resolution: '+path.length+' · 32 children/parent';
    $('lab-id').dataset.valid='true';
  }catch(e){
    $('lab-id').textContent='Đầu vào không hợp lệ';
    $('lab-parent').textContent=e.message;
    $('lab-id').dataset.valid='false';
  }
}
$('lab-encode').addEventListener('click',inspectId);
$('lab-path').addEventListener('keydown',e=>{if(e.key==='Enter')inspectId()});
$('lab-root').addEventListener('keydown',e=>{if(e.key==='Enter')inspectId()});
inspectId();

function weighted(){
  const cells=[{key:'A',area:1,val:20},{key:'B',area:2,val:50},{key:'C',area:0.5,val:80}];
  const mean=cells.reduce((a,x)=>a+x.val,0)/cells.length;
  const weighted=cells.reduce((a,x)=>a+x.area*x.val,0)/cells.reduce((a,x)=>a+x.area,0);
  $('lab-mean').textContent=fmt(mean)+' °C';
  $('lab-weighted').textContent=fmt(weighted)+' °C';
  $('lab-diff').textContent=fmt(weighted-mean)+' °C';
  $('lab-weighted-detail').textContent='A: 1 km² × 20°C; B: 2 km² × 50°C; C: 0,5 km² × 80°C. Đây là ví dụ số học tổng hợp, không phải đo nhiệt độ thật hoặc cell V5 thật.';
}
weighted();
function hierarchy(){
  const res=Number($('lab-level').value), n=12n*(32n**BigInt(res));
  const areaKm2=510065621.724/Number(n);
  $('lab-resolution').textContent=String(res);
  $('lab-count').textContent=n.toLocaleString('vi-VN');
  $('lab-pathbits').textContent=(5*res)+'/50 bit';
  $('lab-meanarea').textContent=areaKm2>=1?fmt(areaKm2)+' km²':fmt(areaKm2*1e6)+' m²';
  $('lab-theoretical').textContent='Trung bình toán học, không chứng minh các ô cùng diện tích hay cùng chất lượng hình học.';
}
$('lab-level').addEventListener('input',hierarchy);
hierarchy();
