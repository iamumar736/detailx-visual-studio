'use strict';
const $=id=>document.getElementById(id);
let state={scene:'tint',vlt:35,color:0,finish:'gloss',explode:false};
const colors=[
 {name:'Candy Red',hex:'#cf1e36',filter:'hue-rotate(0deg) saturate(1.12)',code:'DX / 01'},
 {name:'Nardo Grey',hex:'#818f95',filter:'grayscale(1) saturate(0) contrast(1.06) brightness(1.13)',code:'DX / 02'},
 {name:'Obsidian Black',hex:'#1a2026',filter:'grayscale(1) brightness(.62) contrast(1.25)',code:'DX / 03'},
 {name:'Electric Blue',hex:'#1b78bc',filter:'hue-rotate(220deg) saturate(1.3)',code:'DX / 04'},
 {name:'Midnight Purple',hex:'#602bba',filter:'hue-rotate(290deg) saturate(1.2)',code:'DX / 05'},
 {name:'British Racing Green',hex:'#125346',filter:'hue-rotate(135deg) saturate(.8) brightness(.82)',code:'DX / 06'},
 {name:'Pearl White',hex:'#e8ece9',filter:'grayscale(1) brightness(1.65) contrast(.73)',code:'DX / 07'},
 {name:'Burnt Orange',hex:'#cb552b',filter:'hue-rotate(31deg) saturate(1.1)',code:'DX / 08'}
];
const tintPics={
 hero:'https://images.pexels.com/photos/14445435/pexels-photo-14445435.jpeg?auto=compress&cs=tinysrgb&w=2000',
 front:'https://images.pexels.com/photos/14445439/pexels-photo-14445439.jpeg?auto=compress&cs=tinysrgb&w=2000',
 detail:'https://images.pexels.com/photos/14445436/pexels-photo-14445436.jpeg?auto=compress&cs=tinysrgb&w=2000'
};
const mediaFallback='../images/gallery/finished-mobile-detailing-result.webp';
function activate(scene){
 if(!['tint','wrap'].includes(scene))return;
 state.scene=scene;
 document.querySelectorAll('.scene').forEach(e=>{const a=e.dataset.name===scene;e.classList.toggle('active',a);e.setAttribute('aria-hidden',a?'false':'true');});
 document.querySelectorAll('[data-scene]').forEach(e=>{const a=e.dataset.scene===scene;e.classList.toggle('active',a);e.classList.toggle('selected',a);if(e.getAttribute('role')==='tab')e.setAttribute('aria-selected',String(a))});
 $('issueTag').textContent=scene==='tint'?'GLASS EDITION':'COLOUR EDITION';
 $('stageDesc').textContent=scene==='tint'?'VLT FILM VISUALIZER':'LIVE COLOUR CONCEPT';
 $('stageNumber').textContent=scene==='tint'?'01':'02';
 if(!$('mobileMenu').hidden){$('mobileMenu').hidden=true;$('menu').setAttribute('aria-expanded','false')}
 document.querySelector('.stage').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
function setVlt(v){const n=Math.max(5,Math.min(70,Math.round(Number(v)||35)));state.vlt=n;
 $('vltValue').innerHTML=n+'<span>%</span>';$('tintSlider').value=n;
 document.querySelectorAll('[data-vlt]').forEach(x=>x.classList.toggle('selected',Number(x.dataset.vlt)===n));
 $('tintDarken').style.background='rgba(0,0,0,'+(0.02+(70-n)/65*.41).toFixed(3)+')';
 $('tintAdvice').textContent=n>=60?'Aspetto discreto · pellicola chiara':n>=36?'Look equilibrato · pellicola media':n>=16?'Privacy accentuata · pellicola scura':'Look intenso · pellicola molto scura';
}
function paint(){let c=colors[state.color],f=state.finish;
 let finishFilter=f==='gloss'?'':f==='satin'?' saturate(.82) contrast(.94)':' saturate(.7) contrast(.88) brightness(.92)';
 const full=c.filter+finishFilter;
 $('wrapPhoto').style.setProperty('--wrap-filter',full);
 document.querySelectorAll('.slice').forEach(el=>el.style.setProperty('--wrap-filter',full));
 $('colorName').textContent=c.name;$('colorRef').textContent=c.code;
 $('previewColor').textContent=c.name.toUpperCase();$('finishLabel').textContent=f.toUpperCase()+' FINISH';
 document.querySelectorAll('.swatch').forEach(x=>{let sel=Number(x.dataset.index)===state.color;x.classList.toggle('selected',sel);x.setAttribute('aria-pressed',String(sel));});
 document.querySelectorAll('[data-finish]').forEach(x=>{let sel=x.dataset.finish===f;x.classList.toggle('selected',sel);x.setAttribute('aria-pressed',String(sel));});
}
function explode(on){state.explode=on;const shell=$('photoShell');shell.classList.toggle('exploded',on);$('explodeBtn').setAttribute('aria-pressed',String(on));$('explodeText').textContent=on?'REASSEMBLE':'PANEL REVEAL';}
function buildExplode(){
 const shapes=[
 ['polygon(0% 0%,48% 0%,44% 43%,37% 57%,0% 63%)','-7%','-11%','-5deg'],
 ['polygon(48% 0%,100% 0%,100% 44%,76% 49%,44% 43%)','6%','-10%','4deg'],
 ['polygon(0% 63%,36% 52%,42% 81%,0% 89%)','-11%','0%','-6deg'],
 ['polygon(37% 54%,57% 50%,60% 83%,42% 81%)','-1%','7%','-3deg'],
 ['polygon(57% 48%,100% 44%,100% 87%,60% 83%)','9%','5%','6deg'],
 ['polygon(0% 89%,42% 81%,60% 83%,100% 87%,100% 100%,0% 100%)','0%','13%','1deg']
 ];
 const src=$('wrapPhoto').src;
 $('explodeLayer').style.setProperty('--slice-image','url("'+src+'")');
 shapes.forEach(a=>{const s=document.createElement('div');s.className='slice';s.style.setProperty('--clip',a[0]);s.style.setProperty('--tx',a[1]);s.style.setProperty('--ty',a[2]);s.style.setProperty('--rotate',a[3]);$('explodeLayer').append(s)});
}
function quote(){const details=state.scene==='tint'?`Oscuramento vetri · VLT preview ${state.vlt}%`:`Wrapping · ${colors[state.color].name} / ${state.finish.toUpperCase()} finish`;$('selectionReadout').value=details;if(typeof $('quoteDialog').showModal==='function')$('quoteDialog').showModal();else $('quoteDialog').setAttribute('open','');}
function safeImg(el){el.addEventListener('error',()=>{if(!el.dataset.fallback){el.dataset.fallback='1';el.src=mediaFallback}})}
document.querySelectorAll('.tint-photo,.wrap-photo').forEach(safeImg);
$('wrapPhoto').addEventListener('load',()=>{$('explodeLayer').style.setProperty('--slice-image','url("'+$('wrapPhoto').src+'")')});
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>activate(b.dataset.scene)));
document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',quote));
document.querySelectorAll('[data-vlt]').forEach(b=>b.addEventListener('click',()=>setVlt(b.dataset.vlt)));
$('tintSlider').addEventListener('input',e=>setVlt(e.target.value));
document.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-angle]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
 const img=$('tintPhoto'),url=tintPics[b.dataset.angle];
 img.classList.add('shift');
 setTimeout(()=>{img.src=url; img.classList.remove('shift')},260);
}));
$('menu').addEventListener('click',()=>{let next=$('mobileMenu').hidden;$('mobileMenu').hidden=!next;$('menu').setAttribute('aria-expanded',String(next))});
$('sendQuote').addEventListener('click',()=>{let car=$('carModel').value.trim(),config=$('selectionReadout').value;let msg=`Ciao DETAILX! Vorrei un preventivo.\nServizio: ${config}\nAuto: ${car||'Da definire'}\nZona: Mirano / Venezia.\nPotete darmi maggiori informazioni?`;window.open('https://wa.me/393898563081?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')});
$('swatches').innerHTML=colors.map((c,i)=>`<button type="button" class="swatch${i===0?' selected':''}" data-index="${i}" style="background:${c.hex}" aria-label="${c.name}" aria-pressed="${i===0}" title="${c.name}"></button>`).join('');
$('swatches').addEventListener('click',e=>{let b=e.target.closest('.swatch');if(b){state.color=Number(b.dataset.index);paint();}});
$('finishes').addEventListener('click',e=>{let b=e.target.closest('[data-finish]');if(b){state.finish=b.dataset.finish;paint();}});
$('explodeBtn').addEventListener('click',()=>explode(!state.explode));
$('resetBtn').addEventListener('click',()=>{state.color=0;state.finish='gloss';explode(false);paint()});
$('quoteDialog').addEventListener('click',e=>{if(e.target===$('quoteDialog'))$('quoteDialog').close()});
setVlt(35);buildExplode();paint();
