const PRODUCTS = [{"slug": "melatonin", "name": "Melatonin Gummies", "short": "Sueño profundo y relajación natural.", "benefit": "Dormir mejor", "accent": "#6D2B8C", "img": "product-melatonin.png", "desc": "Creadas para mejorar la calidad del sueño, ayudar a conciliarlo más rápido y mantener el descanso durante la noche. Ideal para mujeres con agendas exigentes y altos niveles de estrés."}, {"slug": "glutathione-collagen-glow", "name": "Glutathione Collagen Glow", "short": "Piel más luminosa, hidratada y uniforme.", "benefit": "Piel radiante", "accent": "#EF4056", "img": "product-glow.png", "desc": "Suplemento avanzado para iluminar, hidratar y rejuvenecer la piel desde dentro. Ideal para mujeres que buscan una piel radiante y uniforme."}, {"slug": "adult-multivitamins", "name": "Adult Multivitamins", "short": "Energía, enfoque y bienestar diario.", "benefit": "Energía diaria", "accent": "#F36B47", "img": "product-adult.png", "desc": "Multivitamínico completo para cubrir las necesidades diarias de mujeres adultas activas. Apoya el sistema inmunológico, la energía y el metabolismo general."}, {"slug": "biotin-collagen-keratin", "name": "Biotin Collagen Keratin", "short": "Cabello, piel y uñas más fuertes.", "benefit": "Cabello, piel y uñas", "accent": "#27A9D8", "img": "product-biotin.png", "desc": "Fórmula especializada para mujeres que desean fortalecer su cabello, uñas y lograr una piel visiblemente más saludable."}];

let cart = JSON.parse(localStorage.getItem('relindaCart')||'[]');
const $=(s)=>document.querySelector(s); const $$=(s)=>document.querySelectorAll(s);
function money(n){return 'DOP$'+Number(n).toLocaleString('es-DO')}
function saveCart(){localStorage.setItem('relindaCart',JSON.stringify(cart));renderCart()}
function renderCart(){const count=$('#cartCount'),items=$('#cartItems'),total=$('#cartTotal'),checkout=$('#checkoutBtn'); if(!count||!items)return; count.textContent=cart.reduce((a,i)=>a+i.qty,0); items.innerHTML=cart.length?cart.map(i=>`<div class="cart-item"><div><b>${i.name}</b><br><small>${money(i.price)} x ${i.qty}</small></div><button data-remove="${i.name}">×</button></div>`).join(''):'<p>Tu carrito está vacío.</p>'; const t=cart.reduce((a,i)=>a+i.price*i.qty,0); total.textContent=money(t); const text=encodeURIComponent('Hola Relinda, quiero comprar: '+cart.map(i=>`${i.qty} x ${i.name}`).join(', ')+` Total: ${money(t)}`); checkout.href='https://wa.me/?text='+text; $$('[data-remove]').forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.name!==b.dataset.remove);saveCart()})}
function addToCart(name,price){const found=cart.find(i=>i.name===name); if(found)found.qty++; else cart.push({name,price:Number(price),qty:1}); saveCart(); toast('Agregado al carrito')}
function toast(msg){const t=$('#toast'); if(!t)return; t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
$$('.add-cart').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.name,btn.dataset.price)));
const drawer=$('#cartDrawer'), overlay=$('#overlay'); $('#cartBtn')?.addEventListener('click',()=>{drawer.classList.add('open');overlay.classList.add('show')}); $('#closeCart')?.addEventListener('click',closeDrawer); overlay?.addEventListener('click',closeDrawer); function closeDrawer(){drawer?.classList.remove('open');overlay?.classList.remove('show')}
$('.nav-toggle')?.addEventListener('click',()=>$('#siteHeader').classList.toggle('active'));
window.addEventListener('scroll',()=>$('#siteHeader')?.classList.toggle('scrolled',window.scrollY>10));
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12}); $$('.reveal').forEach(el=>io.observe(el));
$$('.quiz-options button').forEach(b=>b.addEventListener('click',()=>{location.href=b.dataset.go}));
$$('.filter-chips button').forEach(b=>b.addEventListener('click',()=>{ $$('.filter-chips button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); const f=b.dataset.filter; $$('.product-card').forEach(card=>{card.style.display=(f==='all'||card.dataset.category===f)?'block':'none'})}));
$('#searchInput')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase(); $$('.product-card').forEach(card=>{card.style.display=card.innerText.toLowerCase().includes(q)?'block':'none'})});
$$('.quick-view').forEach(btn=>btn.addEventListener('click',()=>{const p=PRODUCTS.find(x=>x.slug===btn.dataset.slug); const modal=$('#quickModal'); $('#quickContent').innerHTML=`<div class="quick-content" style="--accent:${p.accent}"><img src="${p.img}" alt="${p.name}"><div><p class="eyebrow">${p.benefit}</p><h2>${p.name}</h2><p>${p.desc}</p><p class="big-price">DOP$1,640</p><button class="btn primary add-cart-modal">Agregar al carrito</button> <a class="btn ghost" href="product-${p.slug}.html">Ver detalles</a></div></div>`; modal.classList.add('show'); $('.add-cart-modal').onclick=()=>addToCart(p.name,1640)}));
$('#quickClose')?.addEventListener('click',()=>$('#quickModal').classList.remove('show')); $('#quickModal')?.addEventListener('click',e=>{if(e.target.id==='quickModal')e.currentTarget.classList.remove('show')});
renderCart();


// Hero product carousel
const heroProducts = $$('.showcase-product');
const heroButtons = $$('#heroTabs button');
let heroIndex = 0;
function setHero(index){
  if(!heroProducts.length) return;
  heroIndex = index % heroProducts.length;
  heroProducts.forEach((img,i)=>img.classList.toggle('active', i===heroIndex));
  heroButtons.forEach((btn,i)=>btn.classList.toggle('active', i===heroIndex));
}
heroButtons.forEach(btn=>btn.addEventListener('click',()=>setHero(Number(btn.dataset.hero))));
if(heroProducts.length){
  setInterval(()=>setHero((heroIndex+1)%heroProducts.length), 3200);
}


// Interactive Relinda Circle + mouse/scroll motion
const heroStage = document.querySelector('.hero-stage');
const heroArea = document.querySelector('.dynamic-hero');
function applyTilt(area, target, strength=12){
  if(!area || !target || window.innerWidth < 900) return;
  area.addEventListener('mousemove', (e)=>{
    const r = area.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    target.style.transform = `rotateY(${px * strength}deg) rotateX(${py * -strength}deg) translate3d(${px * 8}px, ${py * 6}px, 0)`;
  });
  area.addEventListener('mouseleave', ()=>{target.style.transform = ''});
}
applyTilt(heroArea, heroStage, 8);

const WHEEL_DATA = {
  glow: {
    benefit: 'Piel radiante',
    title: 'Glutathione Collagen Glow',
    desc: 'Fórmula anti-edad y glow diario para una piel luminosa desde adentro.',
    img: 'product-glow.png',
    link: 'product-glutathione-collagen-glow.html',
    accent: '#EF4056'
  },
  melatonin: {
    benefit: 'Sueño profundo',
    title: 'Melatonin Gummies',
    desc: 'Apoya el descanso, ayuda a conciliar el sueño y a mantenerlo durante la noche.',
    img: 'product-melatonin.png',
    link: 'product-melatonin.html',
    accent: '#A24AE6'
  },
  adult: {
    benefit: 'Energía diaria',
    title: 'Adult Multivitamins',
    desc: 'Soporte diario para energía, inmunidad y bienestar en mujeres activas.',
    img: 'product-adult.png',
    link: 'product-adult-multivitamins.html',
    accent: '#F38B47'
  },
  biotin: {
    benefit: 'Cabello, piel y uñas',
    title: 'Biotin Collagen Keratin',
    desc: 'Fórmula enfocada en fortalecer cabello, uñas y mejorar la apariencia de la piel.',
    img: 'product-biotin.png',
    link: 'product-biotin-collagen-keratin.html',
    accent: '#37C8DE'
  }
};
const wheelScene = document.getElementById('benefitWheelScene');
const wheel = document.getElementById('benefitWheel');
const wheelCenterProduct = document.getElementById('wheelCenterProduct');
const wheelTitle = document.getElementById('wheelTitle');
const wheelDesc = document.getElementById('wheelDesc');
const wheelBenefit = document.getElementById('wheelBenefit');
const wheelLink = document.getElementById('wheelLink');
const wheelSegments = document.querySelectorAll('.wheel-segment');
function setWheelProduct(key){
  const data = WHEEL_DATA[key];
  if(!data || !wheelCenterProduct) return;
  wheelSegments.forEach(seg => seg.classList.toggle('active', seg.dataset.target === key));
  wheelCenterProduct.style.opacity = '0';
  wheelCenterProduct.style.transform = 'translateY(12px) scale(.96)';
  setTimeout(()=>{
    wheelCenterProduct.src = data.img;
    wheelCenterProduct.alt = data.title;
    wheelTitle.textContent = data.title;
    wheelDesc.textContent = data.desc;
    wheelBenefit.textContent = data.benefit;
    wheelLink.href = data.link;
    wheelScene?.style.setProperty('--wheel-accent', data.accent);
    wheelCenterProduct.style.opacity = '1';
    wheelCenterProduct.style.transform = '';
  }, 160);
}
wheelSegments.forEach(seg => {
  seg.addEventListener('mouseenter', ()=>setWheelProduct(seg.dataset.target));
  seg.addEventListener('click', ()=>setWheelProduct(seg.dataset.target));
});
if(wheelScene && wheel){
  wheelScene.addEventListener('mousemove', (e)=>{
    if(window.innerWidth < 900) return;
    const r = wheelScene.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) - 0.5;
    const y = ((e.clientY - r.top) / r.height) - 0.5;
    wheelScene.style.setProperty('--rx', `${y * -7}deg`);
    wheelScene.style.setProperty('--ry', `${x * 10}deg`);
    wheelScene.style.setProperty('--tx', `${x * 8}px`);
    wheelScene.style.setProperty('--ty', `${y * 8}px`);
    document.querySelectorAll('.wheel-float').forEach((el, i) => {
      const mx = (i % 2 === 0 ? 1 : -1) * x * (14 + i * 2);
      const my = (i % 2 === 0 ? -1 : 1) * y * (12 + i * 2);
      el.style.transform = `translate(${mx}px, ${my}px)`;
    });
  });
  wheelScene.addEventListener('mouseleave', ()=>{
    wheelScene.style.setProperty('--rx', '0deg');
    wheelScene.style.setProperty('--ry', '0deg');
    wheelScene.style.setProperty('--tx', '0px');
    wheelScene.style.setProperty('--ty', '0px');
    document.querySelectorAll('.wheel-float').forEach(el => el.style.transform = '');
  });
  const syncWheelScroll = () => {
    const rect = wheelScene.getBoundingClientRect();
    const view = window.innerHeight || document.documentElement.clientHeight;
    const progress = Math.max(0, Math.min(1, (view - rect.top) / (view + rect.height)));
    wheelScene.style.setProperty('--spin', `${(progress - 0.5) * 10}deg`);
  };
  syncWheelScroll();
  window.addEventListener('scroll', syncWheelScroll, { passive: true });
}
