
const PRODUCTS = {
  'melatonin': {name:'Melatonin Gummies', price:1850, image:'product-melatonin.png', desc:'Sueño profundo y relajación natural.', page:'product-melatonin.html'},
  'adult-multivitamins': {name:'Adult Multivitamins', price:1850, image:'product-adult.png', desc:'Energía, enfoque y bienestar diario.', page:'product-adult-multivitamins.html'},
  'biotin-collagen-keratin': {name:'Biotin Collagen Keratin', price:1850, image:'product-biotin.png', desc:'Cabello, piel y uñas más fuertes.', page:'product-biotin-collagen-keratin.html'}
};
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const CART_KEY = 'relinda_cart';
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ cart = []; }
const persist = ()=> localStorage.setItem(CART_KEY, JSON.stringify(cart));
const format = n => 'DOP$' + Number(n).toLocaleString('en-US');
function updateCount(){
  const count = cart.reduce((a,b)=>a+b.qty,0);
  ['#cartCount'].forEach(sel=>{ const el=$(sel); if(el) el.textContent = count; });
}
function renderCart(){
  const wrap = $('#cartItems'); const total = $('#cartTotal');
  if(!wrap || !total) return;
  if(!cart.length){ wrap.innerHTML = '<p style="color:#74626c">Tu carrito está vacío.</p>'; total.textContent='DOP$0'; return; }
  wrap.innerHTML = cart.map((item,i)=>`<div class="cart-item"><div><strong>${item.name}</strong><small>${format(item.price)}</small></div><div><button class="qty-btn" data-qty="minus" data-index="${i}">-</button> <span>${item.qty}</span> <button class="qty-btn" data-qty="plus" data-index="${i}">+</button></div><button class="qty-btn" data-qty="remove" data-index="${i}">×</button></div>`).join('');
  total.textContent = format(cart.reduce((a,b)=>a+b.price*b.qty,0));
}
function addToCart(name, price){
  const existing = cart.find(x=>x.name===name);
  if(existing) existing.qty += 1; else cart.push({name, price:Number(price), qty:1});
  persist(); updateCount(); renderCart(); showToast();
}
function openCart(){ const d=$('#cartDrawer'), o=$('#overlay'); if(d){d.classList.add('open');} if(o){o.classList.add('show');} }
function closeCart(){ const d=$('#cartDrawer'), o=$('#overlay'); if(d){d.classList.remove('open');} if(o){o.classList.remove('show');} }
function showToast(){ const t=$('#toast'); if(!t) return; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 1800); }

document.addEventListener('click', e => {
  const add = e.target.closest('.add-cart');
  if(add){ addToCart(add.dataset.name, add.dataset.price); }
  const q = e.target.closest('.qty-btn');
  if(q){
    const i = Number(q.dataset.index), mode = q.dataset.qty;
    if(mode==='plus') cart[i].qty += 1;
    if(mode==='minus') cart[i].qty = Math.max(1, cart[i].qty - 1);
    if(mode==='remove') cart.splice(i,1);
    persist(); updateCount(); renderCart();
  }
  if(e.target.closest('#cartBtn') || e.target.closest('#mobileCartBtn')) openCart();
  if(e.target.closest('#closeCart') || e.target.closest('#overlay')) closeCart();
  const quick = e.target.closest('.quick-view');
  if(quick){
    const slug = quick.dataset.slug; const p = PRODUCTS[slug];
    const modal = $('#quickModal'); const content = $('#quickContent');
    if(modal && content && p){
      content.innerHTML = `<div class="quick-content-grid"><img src="${p.image}" alt="${p.name}"><div><p class="eyebrow">Vista rápida</p><h3>${p.name}</h3><p>${p.desc}</p><p class="quick-price">${format(p.price)}</p><div class="actions"><button class="btn primary add-cart" data-name="${p.name}" data-price="${p.price}">Agregar</button><a class="btn ghost" href="${p.page}">Ver detalles</a></div></div></div>`;
      modal.classList.add('open'); const o=$('#overlay'); if(o) o.classList.add('show');
    }
  }
  if(e.target.closest('#quickClose')){ const m=$('#quickModal'); if(m) m.classList.remove('open'); closeCart(); }
  const chip = e.target.closest('.filter-chips button');
  if(chip){
    $$('.filter-chips button').forEach(b=>b.classList.remove('active')); chip.classList.add('active');
    const filter = chip.dataset.filter;
    $$('#productGrid .product-card').forEach(card=>{
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  }
  const tab = e.target.closest('#heroTabs button');
  if(tab){
    const idx = Number(tab.dataset.hero);
    $$('#heroTabs button').forEach(b=>b.classList.remove('active')); tab.classList.add('active');
    $$('.showcase-product').forEach((img, i)=>img.classList.toggle('active', i===idx));
  }
  const toggle = e.target.closest('.nav-toggle');
  if(toggle){ $('.nav')?.classList.toggle('open'); }
});
const search = $('#searchInput');
if(search){
  search.addEventListener('input', e => {
    const val = e.target.value.toLowerCase().trim();
    $$('#productGrid .product-card').forEach(card => {
      const txt = card.textContent.toLowerCase();
      card.classList.toggle('hidden', !txt.includes(val));
    });
  });
}
const modal = $('#quickModal');
if(modal){
  modal.addEventListener('click', e => { if(e.target===modal){ modal.classList.remove('open'); $('#overlay')?.classList.remove('show'); } });
}
updateCount(); renderCart();
