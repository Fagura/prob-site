/* Generator de albume cu fotografii – logica aplicației */
(function () {
  'use strict';

  const STORE_KEY = 'fotoalbum.v1';
  const MAX_SIDE = 1400; // fotografiile încărcate sunt micșorate la această latură

  const demo = [
    { id: 'munti', title: 'Munți', desc: 'Creste și apusuri în munți.', layout: 'grid',
      photos: ['munti-1', 'munti-2', 'munti-3', 'munti-4'] },
    { id: 'mare', title: 'La mare', desc: 'Lumina de pe malul mării.', layout: 'polaroid',
      photos: ['mare-1', 'mare-2', 'mare-3', 'mare-4'] },
    { id: 'noapte', title: 'Noaptea', desc: 'Cer înstelat deasupra pădurii.', layout: 'masonry',
      photos: ['noapte-1', 'noapte-2', 'noapte-3', 'noapte-4'] }
  ].map(a => ({
    ...a,
    created: Date.now(),
    photos: a.photos.map((p, i) => ({ src: `images/${p}.jpg`, name: `${a.title} ${i + 1}` }))
  }));

  // ---------- Stocare ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* stocare indisponibilă */ }
    return demo.slice();
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(albums));
      return true;
    } catch (e) {
      alert('Albumul e prea mare pentru memoria browserului. Încearcă mai puține fotografii.');
      return false;
    }
  }

  let albums = load();
  let current = null;   // albumul deschis
  let editing = null;   // albumul în editare
  let pending = [];     // fotografii în formular
  let lbIndex = 0;
  let slideTimer = null;

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Navigare ----------
  function show(view) {
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]');
    if (!nav) return;
    e.preventDefault();
    if (nav.dataset.nav === 'home') { renderAlbums(); show('home'); }
    if (nav.dataset.nav === 'new') openForm(null);
  });

  // ---------- Lista albumelor ----------
  function renderAlbums() {
    const q = $('#search').value.trim().toLowerCase();
    const list = albums.filter(a => (a.title + ' ' + a.desc).toLowerCase().includes(q));
    $('#albums').innerHTML = list.length ? list.map(a => {
      const imgs = a.photos.slice(0, 3);
      const cls = imgs.length === 0 ? 'empty' : imgs.length < 3 ? 'single' : '';
      const cover = imgs.length
        ? (cls ? `<img src="${a.photos[0].src}" alt="">` : imgs.map(p => `<img src="${p.src}" alt="">`).join(''))
        : 'Fără fotografii';
      return `<article class="album-card" data-id="${a.id}">
        <div class="cover ${cls}">${cover}</div>
        <div class="info"><h3>${esc(a.title)}</h3>
        <div class="meta">${a.photos.length} fotografii · ${esc(a.desc || '')}</div></div>
      </article>`;
    }).join('') : '<p class="muted">Niciun album găsit.</p>';
  }
  $('#search').addEventListener('input', renderAlbums);
  $('#albums').addEventListener('click', e => {
    const card = e.target.closest('.album-card');
    if (card) openAlbum(card.dataset.id);
  });

  // ---------- Album ----------
  function openAlbum(id) {
    current = albums.find(a => a.id === id);
    if (!current) return;
    $('#a-title').textContent = current.title;
    $('#a-desc').textContent = current.desc;
    $('#a-layout').value = current.layout;
    renderGallery();
    show('album');
  }
  function renderGallery() {
    const g = $('#gallery');
    g.className = 'gallery ' + current.layout;
    g.innerHTML = current.photos.map((p, i) =>
      `<figure style="--r:${((i * 37) % 9) - 4}deg"><img src="${p.src}" alt="${esc(p.name)}" data-i="${i}" loading="lazy">
       <figcaption>${esc(p.name)}</figcaption></figure>`).join('')
      || '<p class="muted">Albumul nu are fotografii. Apasă „Editează” pentru a adăuga.</p>';
  }
  $('#gallery').addEventListener('click', e => {
    const img = e.target.closest('img');
    if (img) openLightbox(+img.dataset.i);
  });
  $('#a-layout').addEventListener('change', e => {
    current.layout = e.target.value; save(); renderGallery();
  });
  $('#a-delete').addEventListener('click', () => {
    if (!confirm(`Ștergi albumul „${current.title}”?`)) return;
    albums = albums.filter(a => a !== current); save();
    renderAlbums(); show('home');
  });
  $('#a-edit').addEventListener('click', () => openForm(current));
  $('#a-slide').addEventListener('click', () => {
    if (!current.photos.length) return;
    openLightbox(0);
    slideTimer = setInterval(() => step(1), 3000);
  });
  $('#a-export').addEventListener('click', exportAlbum);

  // ---------- Formular ----------
  const form = $('#album-form');
  function openForm(album) {
    editing = album;
    form.reset();
    $('#form-title').textContent = album ? 'Editează albumul' : 'Album nou';
    if (album) {
      form.title.value = album.title;
      form.desc.value = album.desc;
      form.layout.value = album.layout;
    }
    pending = album ? album.photos.slice() : [];
    renderPreview();
    show('new');
  }
  function renderPreview() {
    $('#preview').innerHTML = pending.map((p, i) =>
      `<div class="thumb"><img src="${p.src}" alt=""><button type="button" data-rm="${i}" aria-label="Elimină">×</button></div>`).join('');
  }
  $('#preview').addEventListener('click', e => {
    const b = e.target.closest('[data-rm]');
    if (b) { pending.splice(+b.dataset.rm, 1); renderPreview(); }
  });

  const drop = $('#drop'), fileInput = $('#files');
  drop.addEventListener('click', () => fileInput.click());
  drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
  fileInput.addEventListener('change', () => { addFiles(Array.from(fileInput.files)); fileInput.value = ''; });
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => addFiles(Array.from(e.dataTransfer.files)));

  async function addFiles(files) {
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      try {
        pending.push({ src: await resize(f), name: f.name.replace(/\.[^.]+$/, '') });
        renderPreview();
      } catch (e) { /* fișier ilizibil – ignorat */ }
    }
  }
  function resize(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      title: form.title.value.trim(),
      desc: form.desc.value.trim(),
      layout: form.layout.value,
      photos: pending
    };
    if (!data.title) return;
    let album;
    if (editing) { album = Object.assign(editing, data); }
    else { album = { id: 'a' + Date.now(), created: Date.now(), ...data }; albums.unshift(album); }
    if (!save() && !editing) albums.shift();
    openAlbum(album.id);
  });

  // ---------- Lightbox / slideshow ----------
  const lb = $('#lightbox');
  function openLightbox(i) { lbIndex = i; drawLb(); lb.hidden = false; }
  function closeLightbox() { lb.hidden = true; clearInterval(slideTimer); slideTimer = null; }
  function step(d) { const n = current.photos.length; lbIndex = (lbIndex + d + n) % n; drawLb(); }
  function drawLb() {
    const p = current.photos[lbIndex], img = $('#lb-img');
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    img.src = p.src; img.alt = p.name;
    $('#lb-cap').textContent = `${p.name} · ${lbIndex + 1} / ${current.photos.length}`;
  }
  lb.querySelector('.lb-close').onclick = closeLightbox;
  lb.querySelector('.lb-prev').onclick = () => step(-1);
  lb.querySelector('.lb-next').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // ---------- Export album ca pagină HTML ----------
  async function toDataUrl(src) {
    if (src.startsWith('data:')) return src;
    try {
      const blob = await (await fetch(src)).blob();
      return await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
    } catch (e) { return new URL(src, location.href).href; }
  }
  async function exportAlbum() {
    const a = current;
    const imgs = await Promise.all(a.photos.map(async p =>
      `<figure><img src="${await toDataUrl(p.src)}" alt="${esc(p.name)}"><figcaption>${esc(p.name)}</figcaption></figure>`));
    const html = `<!doctype html><html lang="ro"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(a.title)}</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#16141c;color:#eee;text-align:center}
h1{margin:32px 16px 4px}p{color:#aaa;margin:0 16px 24px}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;padding:0 16px 40px;max-width:1200px;margin:auto}
figure{margin:0;background:#22202b;border-radius:10px;overflow:hidden}img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
figcaption{padding:8px;font-size:.9rem;color:#ccc}</style></head><body>
<h1>${esc(a.title)}</h1><p>${esc(a.desc)}</p><main>${imgs.join('')}</main></body></html>`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    link.download = a.title.replace(/[^\w\-]+/g, '_') + '.html';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  renderAlbums();
})();
