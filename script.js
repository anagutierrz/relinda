
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

const PRODUCTS = {
  'melatonin': {name:'Melatonin Gummies', price:1850, image:'product-melatonin.png', desc:'Sueño profundo y relajación natural.'},
  'adult-multivitamins': {name:'Adult Multivitamins', price:1850, image:'product-adult.png', desc:'Energía, enfoque y bienestar diario.'},
  'biotin-collagen-keratin': {name:'Biotin Collagen Keratin', price:1850, image:'product-biotin.png', desc:'Cabello, piel y uñas más fuertes.'}
};

const header = $('#siteHeader');
$('.nav-toggle')?.addEventListener('click', ()=> header?.classList.toggle('active'));
$$('.nav a').forEach(a=>a.addEventListener('click', ()=>header?.classList.remove('active')));

const overlay = $('#overlay');
const drawer = $('#cartDrawer');
const cartBtns = [$('#cartBtn'), $('#mobileCartBtn')].filter(Boolean);
const closeCart = $('#closeCart');
const cartItemsEl = $('#cartItems');
const cartTotalEl = $('#cartTotal');
const cartCountEls = [$('#cartCount')].filter(Boolean);
const toast = $('#toast');

let cart = JSON.parse(localStorage.getItem('relinda_cart') || '[]');
function saveCart(){ localStorage.setItem('relinda_cart', JSON.stringify(cart)); renderCart(); }
function formatDOP(n){ return 'DOP$' + Number(n).toLocaleString('en-US'); }
function renderCart(){
  const count = cart.reduce((a,b)=>a+b.qty,0);
  cartCountEls.forEach(el=>el.textContent = count);
  if(cartItemsEl){
    cartItemsEl.innerHTML = cart.length ? cart.map((item,i)=>`
      <div class="cart-item">
        <div><strong>${item.name}</strong><div>${formatDOP(item.price)} · ${item.qty}</div></div>
        <button data-index="${i}">Quitar</button>
      </div>`).join('') : '<p>Tu carrito está vacío.</p>';
    cartItemsEl.querySelectorAll('button[data-index]').forEach(btn=>btn.addEventListener('click', ()=>{
      cart.splice(Number(btn.dataset.index),1); saveCart();
    }));
  }
  if(cartTotalEl){ cartTotalEl.textContent = formatDOP(cart.reduce((a,b)=>a+(b.price*b.qty),0)); }
}
function addToCart(name,price){
  const existing = cart.find(i=>i.name===name);
  if(existing) existing.qty += 1; else cart.push({name,price:Number(price),qty:1});
  saveCart();
  toast?.classList.add('show');
  setTimeout(()=>toast?.classList.remove('show'), 1800);
}
$$('.add-cart').forEach(btn=>btn.addEventListener('click', ()=> addToCart(btn.dataset.name, btn.dataset.price)));
function openCart(){ drawer?.classList.add('active'); overlay?.classList.add('active'); }
function shut(){ drawer?.classList.remove('active'); quickModal?.classList.remove('active'); overlay?.classList.remove('active'); }
cartBtns.forEach(btn=>btn.addEventListener('click', openCart));
closeCart?.addEventListener('click', shut);
overlay?.addEventListener('click', shut);
renderCart();

// Quick view
const quickModal = $('#quickModal');
const quickContent = $('#quickContent');
$('#quickClose')?.addEventListener('click', shut);
$$('.quick-view').forEach(btn=>btn.addEventListener('click', ()=>{
  const p = PRODUCTS[btn.dataset.slug];
  if(!p || !quickContent) return;
  quickContent.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <div>
      <p class="eyebrow">Vista rápida</p>
      <h3 style="font-family:Outfit,sans-serif;font-size:38px;line-height:.95;letter-spacing:-.05em;margin:0 0 10px">${p.name}</h3>
      <p style="color:var(--muted);line-height:1.6">${p.desc}</p>
      <p class="big-price" style="margin:10px 0 14px">${formatDOP(p.price)}</p>
      <div class="actions"><button class="btn primary" id="quickAdd">Agregar al carrito</button></div>
    </div>`;
  $('#quickAdd')?.addEventListener('click', ()=>{ addToCart(p.name, p.price); shut(); });
  quickModal?.classList.add('active'); overlay?.classList.add('active');
}));

// Filters + search on shop
const cards = $$('.product-card');
$$('.filter-chips button').forEach(btn=>btn.addEventListener('click', ()=>{
  $$('.filter-chips button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  cards.forEach(card=>{
    card.style.display = (filter==='all' || card.dataset.category===filter) ? '' : 'none';
  });
}));
$('#searchInput')?.addEventListener('input', e=>{
  const q = e.target.value.toLowerCase().trim();
  cards.forEach(card=>{
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
});

// Hero tabs
const showcase = $$('.showcase-product');
$$('#heroTabs button').forEach((btn,idx)=>btn.addEventListener('click', ()=>{
  $$('#heroTabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  showcase.forEach((img,i)=>img.classList.toggle('active', i===idx));
}));

// reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); });
},{threshold:.14});
$$('.reveal').forEach(el=>io.observe(el));
