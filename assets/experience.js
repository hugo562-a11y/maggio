(() => {
 'use strict';
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 const guide=document.querySelector('.style-guide');
 if(guide){
  const options={
   bespoke:{tag:'01 / PERSONAL',title:'屬於你自己的俐落',text:'從正式會面到重要時刻，先找到適合身形與場合的剪裁，再討論面料與細節。',image:'original-03.webp',label:'探索個人量身訂製',path:'bespoke'},
   corporate:{tag:'02 / CORPORATE',title:'讓團隊說同一種語言',text:'從穿著人數、工作情境與品牌色系開始，讓每一位夥伴都有合適的制服。',image:'hero.webp',label:'探索企業團體制服',path:'corporate-uniforms'},
   outerwear:{tag:'03 / OUTERWEAR',title:'把專業帶到戶外',text:'依通勤、外勤與季節需求，討論外層防護、保暖配置及團體穿著方式。',image:'fabric.webp',label:'探索機能外套',path:'functional-outerwear'}
  };
  guide.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
   const data=options[button.dataset.service];
   guide.querySelectorAll('[data-service]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   guide.querySelector('.guide-tag').textContent=data.tag;
   guide.querySelector('.guide-title').textContent=data.title;
   guide.querySelector('.guide-description').textContent=data.text;
   const image=guide.querySelector('.guide-image');image.src='./assets/images/'+data.image;image.alt=data.title;
   const link=guide.querySelector('.guide-link');link.href='./'+data.path+'/index.html';link.textContent=data.label+' ↗';
  }));
 }
 // Progressive enhancement: each original image link still leads to its enquiry without JavaScript.
 const cards=[...document.querySelectorAll('.project-card')];
 if(cards.length){
  const dialog=document.createElement('dialog');dialog.className='collection-dialog';dialog.setAttribute('aria-label','作品款式預覽');
  dialog.innerHTML='<button class="viewer-close" aria-label="關閉作品預覽">✕</button><div class="viewer-image-wrap"><img class="viewer-image" alt=""></div><div class="viewer-copy"><p class="eyebrow viewer-counter"></p><h2 class="viewer-title"></h2><p class="viewer-description"></p><a class="button viewer-enquiry">詢問此類款式 ↗</a><div class="viewer-controls"><button class="viewer-prev" aria-label="上一件作品">←</button><span>探索更多款式</span><button class="viewer-next" aria-label="下一件作品">→</button></div></div>';
  document.body.append(dialog);let current=0,trigger=null;
  function display(index){current=(index+cards.length)%cards.length;const card=cards[current],im=card.querySelector('img');dialog.querySelector('.viewer-image').src=im.src;dialog.querySelector('.viewer-image').alt=im.alt;dialog.querySelector('.viewer-title').textContent=card.querySelector('h3').textContent;dialog.querySelector('.viewer-description').textContent=card.querySelector('.project-caption>p:last-child').textContent;dialog.querySelector('.viewer-counter').textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');dialog.querySelector('.viewer-enquiry').href=card.querySelector('.project-photo').href;}
  cards.forEach((card,i)=>{const link=card.querySelector('.project-photo');link.setAttribute('aria-label','放大查看'+card.querySelector('h3').textContent);link.querySelector('.project-hover').textContent='放大探索 ＋';link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();trigger=link;display(i);dialog.showModal();document.body.classList.add('viewer-open');});});
  dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click',()=>display(current-1));dialog.querySelector('.viewer-next').addEventListener('click',()=>display(current+1));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();display(current-1);}if(e.key==='ArrowRight'){e.preventDefault();display(current+1);}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');trigger?.focus();});
 }
 // A scroll meter and entrance motion keep reading orientation without blocking content.
 const meter=document.createElement('div');meter.className='reading-progress';meter.setAttribute('aria-hidden','true');document.body.append(meter);
 let scheduled=false;
 function progress(){const range=document.documentElement.scrollHeight-innerHeight;meter.style.transform=`scaleX(${range>0?Math.min(1,scrollY/range):0})`;scheduled=false;}
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
 if(!reduced&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('arrived');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.section-heading,.feature,.service-card,.project-card,.workshop-grid figure,.visit-gallery figure').forEach(e=>{e.classList.add('reveal-ready');observer.observe(e);});}
 document.querySelectorAll('.steps').forEach(list=>{
  const live=document.createElement('div');live.className='process-focus';live.setAttribute('aria-live','polite');live.hidden=true;list.after(live);
  const extra=['從你的需求開始。建議先整理使用場合、品項與預計使用日期，讓討論更聚焦。','透過款式與面料討論，確認適合的方向。實際可製作內容與報價，會依需求確認。','讓想法逐步成形。尺寸、製作安排與必要的調整方式，依確認方案進行。','把最後一個環節也照顧好。交付時確認服裝狀態，並說明後續照護與聯繫方式。'];
  [...list.children].forEach((li,i)=>{const title=li.querySelector('h3');const button=document.createElement('button');button.className='process-button';button.innerHTML=title.textContent+' <span aria-hidden="true">＋</span>';button.setAttribute('aria-expanded','false');title.replaceChildren(button);button.addEventListener('click',()=>{const closing=button.getAttribute('aria-expanded')==='true';list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-expanded','false'));if(closing){live.hidden=true;return;}button.setAttribute('aria-expanded','true');live.textContent=extra[i]||extra[0];live.hidden=false;});});
 });
})();


(() => {
 const section=document.querySelector('.client-section');if(!section)return;
 const track=section.querySelector('.client-track'),pause=section.querySelector('[data-client-pause]');
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,hover=false,focus=false;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 function label(){pause.textContent=paused?'播放輪播':'暫停輪播';pause.setAttribute('aria-pressed',String(paused));}label();
 function move(direction){const max=track.scrollWidth-track.clientWidth;let left=track.scrollLeft+direction*(track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap));if(left>max+2)left=0;if(left<0)left=max;track.scrollTo({left,behavior:motion.matches?'auto':'smooth'});}
 section.querySelector('[data-client-prev]').addEventListener('click',()=>move(-1));section.querySelector('[data-client-next]').addEventListener('click',()=>move(1));pause.addEventListener('click',()=>{paused=!paused;label();});
 section.addEventListener('mouseenter',()=>hover=true);section.addEventListener('mouseleave',()=>hover=false);section.addEventListener('focusin',()=>focus=true);section.addEventListener('focusout',e=>{focus=section.contains(e.relatedTarget);});
 track.addEventListener('touchstart',()=>{paused=true;label();},{passive:true});
 motion.addEventListener('change',e=>{if(e.matches){paused=true;label();}});
 setInterval(()=>{const r=section.getBoundingClientRect();if(!paused&&!hover&&!focus&&!document.hidden&&r.bottom>0&&r.top<innerHeight)move(1);},3000);
})();

(() => {
 const video=document.querySelector('#office-video'),button=document.querySelector('.office-sound');if(!video||!button)return;
 video.defaultMuted=true;video.muted=true;button.hidden=false;
 function sync(){const audible=!video.muted&&video.volume>0;button.textContent=audible?'關閉聲音':'開啟聲音';button.setAttribute('aria-pressed',String(audible));}
 button.addEventListener('click',()=>{if(video.muted||video.volume===0){video.muted=false;if(video.volume===0)video.volume=.6;}else video.muted=true;sync();});
 video.addEventListener('volumechange',sync);sync();
 video.play().catch(()=>{/* Native play control remains available when autoplay is restricted. */});
})();
