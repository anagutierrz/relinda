
const PRODUCTS = [
  {slug:'melatonin', name:'Melatonin Gummies', price:1850, benefit:'Dormir mejor', desc:'Sueño profundo y relajación natural.', img:'product-melatonin.png'},
  {slug:'adult-multivitamins', name:'Adult Multivitamins', price:1850, benefit:'Energía diaria', desc:'Energía, enfoque y bienestar diario.', img:'product-adult.png'},
  {slug:'biotin-collagen-keratin', name:'Biotin Collagen Keratin', price:1850, benefit:'Cabello, piel y uñas', desc:'Cabello, piel y uñas más fuertes.', img:'product-biotin.png'}
];
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>document.querySelectorAll(s);
let cart = JSON.parse(localStorage.getItem('relindaCart') || '[]').map(i=>({name:i.name, price:Number(i.price)||0, qty:Number(i.qty)||1}));
function money(n){return 'DOP$'+Number(n).toLocaleString('es-DO')}
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1600); }
function renderCart(){
  const count=$('#cartCount'), items=$('#cartItems'), total=$('#cartTotal'), checkout=$('#checkoutBtn');
  if(count) count.textContent = String(cart.reduce((a,i)=>a+i.qty,0));
  if(!items || !total) return;
  items.innerHTML = cart.length ? cart.map(i=>`<div class="cart-item"><div><b>${i.name}</b><br><small>${money(i.price)} x ${i.qty}</small></div><button data-remove="${i.name}">×</button></div>`).join('') : '<p>Tu carrito está vacío.</p>';
  const totalNum = cart.reduce((a,i)=>a+i.price*i.qty,0);
  total.textContent = money(totalNum);
  if(checkout) checkout.href = 'checkout.html';
  $$('[data-remove]').forEach(btn=>btn.onclick=()=>{cart=cart.filter(i=>i.name!==btn.dataset.remove); saveCart();});
}
function saveCart(){ localStorage.setItem('relindaCart', JSON.stringify(cart)); renderCart(); }
function addToCart(name,price){ const found = cart.find(i=>i.name===name); if(found) found.qty += 1; else cart.push({name,price:Number(price)||0,qty:1}); saveCart(); toast('Agregado al carrito'); }
$$('.add-cart').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.name,btn.dataset.price)));
const drawer=$('#cartDrawer'), overlay=$('#overlay');
function openDrawer(){drawer?.classList.add('open'); overlay?.classList.add('show')}
function closeDrawer(){drawer?.classList.remove('open'); overlay?.classList.remove('show')}
$('#cartBtn')?.addEventListener('click',openDrawer); $('#mobileCartBtn')?.addEventListener('click',openDrawer); $('#closeCart')?.addEventListener('click',closeDrawer); overlay?.addEventListener('click',closeDrawer);
$('.nav-toggle')?.addEventListener('click', ()=> $('#siteHeader')?.classList.toggle('active'));
window.addEventListener('scroll', ()=> $('#siteHeader')?.classList.toggle('scrolled', window.scrollY > 10));
const observer = new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); }), {threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));
$$('.quiz-options button').forEach(btn=>btn.addEventListener('click',()=> location.href = btn.dataset.go));
$$('.filter-chips button').forEach(btn=>btn.addEventListener('click',()=>{ $$('.filter-chips button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const f=btn.dataset.filter; $$('.product-card').forEach(card=> card.style.display = (f==='all' || card.dataset.category===f) ? '' : 'none'); }));
$('#searchInput')?.addEventListener('input',e=>{ const q=e.target.value.toLowerCase().trim(); $$('.product-card').forEach(card=> card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none');});
$$('.quick-view').forEach(btn=>btn.addEventListener('click',()=>{ const p=PRODUCTS.find(i=>i.slug===btn.dataset.slug); if(!p) return; $('#quickContent').innerHTML = `<div class="quick-content"><img src="${p.img}" alt="${p.name}"><div><p class="eyebrow">${p.benefit}</p><h2>${p.name}</h2><p>${p.desc}</p><p class="big-price">${money(p.price)}</p><div class="actions"><button class="btn primary add-cart-modal">Agregar</button><a class="btn ghost" href="product-${p.slug}.html">Ver detalles</a></div></div></div>`; $('#quickModal')?.classList.add('show'); $('.add-cart-modal')?.addEventListener('click',()=>addToCart(p.name,p.price)); }));
$('#quickClose')?.addEventListener('click',()=> $('#quickModal')?.classList.remove('show')); $('#quickModal')?.addEventListener('click',e=>{ if(e.target.id==='quickModal') e.currentTarget.classList.remove('show'); });
// Home hero tabs
const heroImages = $$('.showcase-product');
const heroTabs = $$('#heroTabs button');
let heroIndex = 0;
function setHero(i){ if(!heroImages.length) return; heroIndex = i; heroImages.forEach((img,index)=> img.classList.toggle('active', index===i)); heroTabs.forEach((btn,index)=> btn.classList.toggle('active', index===i)); }
heroTabs.forEach(btn=>btn.addEventListener('click',()=> setHero(Number(btn.dataset.hero))));
if(heroImages.length) setInterval(()=> setHero((heroIndex+1)%heroImages.length), 3200);
// Benefit wheel interaction
const wheelData = {
  longevity:{title:'Wellness by Relinda', benefit:'Longevidad', desc:'Una marca pensada para bienestar femenino y crecimiento a largo plazo.', img:'relinda-logo.png', link:'about.html'},
  melatonin:{title:'Melatonin Gummies', benefit:'Dormir mejor', desc:'Sueño profundo y relajación natural.', img:'product-melatonin.png', link:'product-melatonin.html'},
  adult:{title:'Adult Multivitamins', benefit:'Energía diaria', desc:'Energía, enfoque y bienestar diario.', img:'product-adult.png', link:'product-adult-multivitamins.html'},
  biotin:{title:'Biotin Collagen Keratin', benefit:'Glow diario', desc:'Cabello, piel y uñas más fuertes.', img:'product-biotin.png', link:'product-biotin-collagen-keratin.html'}
};
function setWheel(key){ const d=wheelData[key]; if(!d) return; $('#wheelCenterProduct') && ($('#wheelCenterProduct').src=d.img); $('#wheelTitle') && ($('#wheelTitle').textContent=d.title); $('#wheelBenefit') && ($('#wheelBenefit').textContent=d.benefit); $('#wheelDesc') && ($('#wheelDesc').textContent=d.desc); $('#wheelLink') && ($('#wheelLink').href=d.link); $$('.wheel-segment').forEach(seg=> seg.classList.toggle('active', seg.dataset.target===key)); }
$$('.wheel-segment').forEach(seg=>{ seg.addEventListener('mouseenter', ()=> setWheel(seg.dataset.target)); seg.addEventListener('click', ()=> setWheel(seg.dataset.target)); });
renderCart();
