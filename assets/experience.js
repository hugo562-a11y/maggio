(() => {
 'use strict';
 const cards=[...document.querySelectorAll('.collection-card')];
 const filters=[...document.querySelectorAll('[data-filter]')];
 let filter='all';
 filters.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let total=0;cards.forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;if(!card.hidden)total++;});document.querySelector('.filter-status').textContent=total+' 款作品';}));
 if(cards.length){
  const dialog=document.createElement('dialog');dialog.className='collection-dialog';dialog.setAttribute('aria-label','作品款式預覽');
  dialog.innerHTML='<button class="viewer-close" aria-label="關閉作品預覽">✕</button><div class="viewer-grid"><div class="viewer-image-wrap"><img class="viewer-image" alt=""></div><div class="viewer-copy"><p class="eyebrow viewer-counter"></p><h2 class="viewer-title"></h2><p class="viewer-description"></p><div class="viewer-controls"><button class="viewer-prev" aria-label="上一件作品">←</button><span>探索更多款式</span><button class="viewer-next" aria-label="下一件作品">→</button></div></div></div>';
  document.body.append(dialog);let current=0,trigger;
  function visible(){return cards.filter(c=>!c.hidden);}
  function display(index){const list=visible();current=(index+list.length)%list.length;const card=list[current],im=card.querySelector('img');dialog.querySelector('.viewer-image').src=im.src;dialog.querySelector('.viewer-image').alt=im.alt;dialog.querySelector('.viewer-title').textContent=card.querySelector('h3').textContent;dialog.querySelector('.viewer-description').textContent=card.querySelector('.collection-caption>p:last-child').textContent;dialog.querySelector('.viewer-counter').textContent=String(current+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');}
  cards.forEach(card=>card.querySelector('button').addEventListener('click',e=>{trigger=e.currentTarget;display(visible().indexOf(card));dialog.showModal();document.body.classList.add('viewer-open');}));
  dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());dialog.querySelector('.viewer-prev').addEventListener('click',()=>display(current-1));dialog.querySelector('.viewer-next').addEventListener('click',()=>display(current+1));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();display(current-1);}if(e.key==='ArrowRight'){e.preventDefault();display(current+1);}});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');trigger?.focus();});
 }
 document.querySelectorAll('.client-section').forEach(section=>{
  const track=section.querySelector('.client-track'),pause=section.querySelector('[data-client-pause]'),motion=matchMedia('(prefers-reduced-motion: reduce)');let paused=motion.matches,hover=false,focus=false;
  function label(){pause.textContent=paused?'播放輪播':'暫停輪播';pause.setAttribute('aria-pressed',String(paused));}label();
  function move(d){const max=track.scrollWidth-track.clientWidth;let left=track.scrollLeft+d*(track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap));if(left>max+2)left=0;if(left<0)left=max;track.scrollTo({left,behavior:motion.matches?'auto':'smooth'});}
  section.querySelector('[data-client-prev]').addEventListener('click',()=>move(-1));section.querySelector('[data-client-next]').addEventListener('click',()=>move(1));pause.addEventListener('click',()=>{paused=!paused;label();});section.addEventListener('mouseenter',()=>hover=true);section.addEventListener('mouseleave',()=>hover=false);section.addEventListener('focusin',()=>focus=true);section.addEventListener('focusout',e=>focus=section.contains(e.relatedTarget));track.addEventListener('touchstart',()=>{paused=true;label();},{passive:true});motion.addEventListener('change',e=>{if(e.matches){paused=true;label();}});
  setInterval(()=>{const r=section.getBoundingClientRect();if(!paused&&!hover&&!focus&&!document.hidden&&r.bottom>0&&r.top<innerHeight)move(1);},3500);
 });
 const video=document.querySelector('#office-video'),sound=document.querySelector('.office-sound');
 if(video&&sound){video.defaultMuted=true;video.muted=true;sound.hidden=false;function sync(){const audible=!video.muted&&video.volume>0;sound.textContent=audible?'關閉聲音':'開啟聲音';sound.setAttribute('aria-pressed',String(audible));}sound.addEventListener('click',()=>{if(video.muted||video.volume===0){video.muted=false;if(video.volume===0)video.volume=.6;}else video.muted=true;sync();});video.addEventListener('volumechange',sync);sync();video.play().catch(()=>{});}
})();
(() => {
 const guide=document.querySelector('.needs-guide');if(!guide)return;
 const buttons=[...guide.querySelectorAll('[data-guide]')];
 buttons.forEach(button=>button.addEventListener('click',()=>{
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  guide.querySelectorAll('.guide-panel').forEach(panel=>panel.hidden=panel.id!=='guide-'+button.dataset.guide);
 }));
})();
