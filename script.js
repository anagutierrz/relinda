
const drawer=document.getElementById('cartDrawer'), overlay=document.getElementById('overlay');
const cartBtn=document.getElementById('cartBtn'), closeCart=document.getElementById('closeCart');
const navToggle=document.querySelector('.nav-toggle'), header=document.querySelector('.site-header');
let cart=JSON.parse(localStorage.getItem('relindaCart')||'[]');
function money(n){return 'DOP$'+n.toLocaleString('es-DO')}
function save(){localStorage.setItem('relindaCart',JSON.stringify(cart));renderCart()}
function renderCart(){
 const count=document.getElementById('cartCount'), items=document.getElementById('cartItems'), total=document.getElementById('cartTotal');
 if(!count||!items||!total)return; count.textContent=cart.length;
 items.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div><strong>${x.name}</strong><p>${money(x.price)}</p></div><button onclick="removeItem(${i})">Eliminar</button></div>`).join(''):'<p>Tu carrito está vacío.</p>';
 total.textContent=money(cart.reduce((s,x)=>s+x.price,0));
}
function removeItem(i){cart.splice(i,1);save()}
document.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{cart.push({name:btn.dataset.name,price:Number(btn.dataset.price)});save();drawer.classList.add('open');overlay.classList.add('show')}));
cartBtn?.addEventListener('click',()=>{drawer.classList.add('open');overlay.classList.add('show')});
closeCart?.addEventListener('click',()=>{drawer.classList.remove('open');overlay.classList.remove('show')});
overlay?.addEventListener('click',()=>{drawer.classList.remove('open');overlay.classList.remove('show')});
navToggle?.addEventListener('click',()=>header.classList.toggle('active'));
renderCart();
