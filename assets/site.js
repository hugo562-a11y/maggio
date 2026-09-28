(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const services = document.querySelector('.services-toggle');
  const dropdown = document.querySelector('.nav-dropdown');
  function closeMenus() {
    nav?.classList.remove('open');
    dropdown?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', '開啟導覽選單');
    services?.setAttribute('aria-expanded', 'false');
  }
  menu?.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? '關閉導覽選單' : '開啟導覽選單');
    nav.classList.toggle('open', isOpen);
  });
  services?.addEventListener('click', () => {
    const isOpen = services.getAttribute('aria-expanded') !== 'true';
    services.setAttribute('aria-expanded', String(isOpen));
    dropdown.classList.toggle('open', isOpen);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) closeMenus();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const wasOpen = menu?.getAttribute('aria-expanded') === 'true';
      const servicesOpen = services?.getAttribute('aria-expanded') === 'true';
      closeMenus();
      if (wasOpen) menu.focus();
      else if (servicesOpen) services.focus();
    }
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenus));
  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const kind = new URLSearchParams(location.search).get('service');
  const kinds = {bespoke:'個人量身訂製',corporate:'企業團體制服',outerwear:'機能外套',other:'其他需求'};
  if (Object.hasOwn(kinds, kind)) form.elements.service.value = kind;
  const status = document.querySelector('#form-status');
  const draft = document.querySelector('#email-draft');
  const draftContent = document.querySelector('#draft-content');
  const emailLink = document.querySelector('#email-link');
  const submit = form.querySelector('button[type="submit"]');
  let endpointReady = false;
  // A configured Python host can receive enquiries. Static/file previews use explicit email drafts.
  if (location.protocol.startsWith('http')) {
    fetch('/api/config', {signal: AbortSignal.timeout(2500)})
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.contactReady === true) {
          endpointReady = true;
          document.querySelector('#privacy-delivery').textContent = '透過本表單送出的內容，將傳送至野木指定的聯絡信箱，用於處理本次詢問。';
          document.querySelector('#submit-label').textContent = '送出詢問';
          document.querySelector('#form-intro').textContent = '留下需求與聯絡方式，我們將與你聯繫。標示 * 為必填項目。';
        }
      }).catch(() => {});
  }
  function showDraft(data, message) {
    const subject = `MAGGIO 網站詢問｜${kinds[data.service]}｜${data.name}`;
    const body = `您好，我想詢問以下服務：\n\n詢問服務：${kinds[data.service]}\n姓名：${data.name}\n公司：${data.company || '未填寫'}\n聯絡電話：${data.phone}\n電子郵件：${data.email || '未填寫'}\n\n需求說明：\n${data.message}\n\n已閱讀並同意網站個人資料使用說明。`;
    draftContent.value = `主旨：${subject}\n收件人：service@maggio.com.tw\n\n${body}`;
    emailLink.href = `mailto:service@maggio.com.tw?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draft.hidden = false;
    status.textContent = message || '詢問內容已整理，尚未寄出。請使用下方郵件傳送功能。';
    draft.focus({preventScroll:true});
    draft.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'center'});
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(data)) data[key] = String(data[key]).trim();
    if (!data.name || !data.message || data.message.length < 5) {
      status.textContent = '請填寫姓名與至少 5 個字的需求說明。';
      status.classList.add('error');
      return;
    }
    status.classList.remove('error');
    if (!endpointReady) { showDraft(data); return; }
    submit.disabled = true;
    draft.hidden = true;
    status.textContent = '正在送出，請稍候…';
    try {
      const response = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data), signal:AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || '暫時無法送出');
      status.textContent = '詢問已送出，謝謝你！我們將依提供的聯絡方式回覆。';
      form.reset();
    } catch {
      status.classList.add('error');
      showDraft(data, '目前無法確認送出，內容已保留。你可以改用下方郵件功能，或來電詢問。');
    } finally { submit.disabled = false; }
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    const copyStatus = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(draftContent.value);
      copyStatus.textContent = '內容已複製，可貼至你的郵件程式。';
    } catch {
      draftContent.focus(); draftContent.select();
      copyStatus.textContent = '已選取內容，請使用複製快捷鍵或長按複製。';
    }
  });
})();
