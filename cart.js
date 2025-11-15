// Simple client-side cart for MonCosmetics
// Exposes: addToCart(id, qty), removeFromCart(id), updateQty(id, qty), getCart()
(function(){
  const KEY = 'mystore_cart_v1';
  const toastEl = document.getElementById('toast');

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]') }catch(e){ return [] } }
  function write(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); dispatchUpdate(); }

  function findItem(cart,id){ return cart.find(i=>i.id===id); }

  function addToCart(id, qty=1){ const cart = read(); const item = findItem(cart,id); if(item){ item.qty = Math.min(99, item.qty + qty); } else { cart.push({id, qty: Math.max(1, qty)}); } write(cart); showToast('Produit ajouté au panier'); }
  function removeFromCart(id){ let cart = read(); cart = cart.filter(i=>i.id!==id); write(cart); }
  function updateQty(id, qty){ const cart = read(); const item = findItem(cart,id); if(!item) return; item.qty = Math.max(0, Math.min(99, Number(qty)||0)); if(item.qty<=0) removeFromCart(id); else write(cart); }
  function clearCart(){ write([]); }
  function getCart(){ return read(); }

  function dispatchUpdate(){ const ev = new CustomEvent('cart:updated', {detail: {cart: getCart()}}); window.dispatchEvent(ev); render(); }

  // announce cart count for screen readers
  function announceCart(){ try{ const ann = document.getElementById('cart-announcer'); if(!ann) return; const cart = getCart(); const count = cart.reduce((s,i)=>s+i.qty,0); ann.textContent = `Panier : ${count} article${count>1 ? 's' : ''}`; }catch(e){} }

  // UI helpers
  function $(sel,root=document){ return root.querySelector(sel) }
  function render(){ const itemsRoot = $('#cart-items'); const totalEl = $('#cart-total'); const countEl = $('#cart-count'); const cart = getCart(); if(!itemsRoot || !totalEl || !countEl) return;
    itemsRoot.innerHTML = '';
    let total = 0; let count = 0;
    cart.forEach(ci=>{ const p = window.PRODUCTS && PRODUCTS.find(x=>x.id===ci.id); const title = p ? p.title : ci.id; const price = p ? p.price : 0; const row = document.createElement('div'); row.className='cart-item'; row.innerHTML = `<div class="ci-media"><img src="${p ? p.img : ''}" alt="${title}" loading="lazy"></div><div class="ci-body"><div class="ci-title">${title}</div><div class="ci-controls"><button class="qty minus" data-id="${ci.id}">−</button><input class="qty-input" data-id="${ci.id}" value="${ci.qty}" inputmode="numeric" aria-label="Quantité pour ${title}"><button class="qty plus" data-id="${ci.id}">+</button><button class="remove" data-id="${ci.id}">Supprimer</button></div></div><div class="ci-price">${(price*ci.qty).toFixed(2)} €</div>`;
      itemsRoot.appendChild(row);
      total += price*ci.qty; count += ci.qty;
    });
    totalEl.textContent = total.toFixed(2);
    countEl.textContent = count;

    // attach controls
    itemsRoot.querySelectorAll('.qty.plus').forEach(b=>b.addEventListener('click', e=>{ const id=e.currentTarget.dataset.id; updateQty(id, (findItem(getCart(),id).qty||0)+1); }));
    itemsRoot.querySelectorAll('.qty.minus').forEach(b=>b.addEventListener('click', e=>{ const id=e.currentTarget.dataset.id; updateQty(id, (findItem(getCart(),id).qty||0)-1); }));
    itemsRoot.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change', e=>{ const id=e.currentTarget.dataset.id; updateQty(id, Number(e.currentTarget.value)||0); }));
    itemsRoot.querySelectorAll('.remove').forEach(b=>b.addEventListener('click', e=>{ removeFromCart(e.currentTarget.dataset.id); }));
  }

  // Toast
  let toastTimer = null;
  function showToast(msg, ms=2200){ if(!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>{ toastEl.classList.remove('show'); }, ms); }

  // Modal toggle
  const modal = $('#cart-modal'); const toggleBtns = document.querySelectorAll('#cart-toggle'); const clearBtn = $('#cart-clear'); const closeBtn = $('#cart-close');
  function openModal(){ if(!modal) return; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); // focus trap simplification
    const firstFocusable = modal.querySelector('button, [href], input, textarea, select');
    // focus trap: remember previous focus, and trap Tab inside modal
    const prev = document.activeElement;
    modal.__prevFocus = prev;
    if(firstFocusable) firstFocusable.focus();
    function trap(e){ if(e.key === 'Tab'){ const focusables = Array.from(modal.querySelectorAll('button, [href], input, textarea, select')).filter(el=>!el.disabled); if(focusables.length===0) return; const first = focusables[0]; const last = focusables[focusables.length-1]; if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); } else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); } } }
    modal.__trap = trap; document.addEventListener('keydown', trap);
  }
  function closeModal(){ if(!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.querySelector('.brand')?.focus(); }

  toggleBtns.forEach(b=>b.addEventListener('click', e=>{ const cart = getCart(); if(cart.length===0){ showToast('Votre panier est vide'); openModal(); } else openModal(); }));
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ clearCart(); showToast('Panier vidé'); });

  // init
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQty = updateQty;
  window.getCart = getCart;

  // render on load
  document.addEventListener('DOMContentLoaded', ()=>{ render(); });
  // also render when PRODUCTS loads (if loaded after)
  if(!window.PRODUCTS){ window.addEventListener('load', ()=>render()); }

  // expose events to other scripts
  // update and announce initial state
  dispatchUpdate(); announceCart();

  // whenever cart updates, also update announcer
  window.addEventListener('cart:updated', ()=>{ announceCart(); });

  // cleanup focus trap when cart modal closes
  document.addEventListener('click', function(e){ if(e.target && e.target.id === 'cart-close'){ if(modal && modal.__trap){ document.removeEventListener('keydown', modal.__trap); try{ modal.__prevFocus && modal.__prevFocus.focus(); }catch(e){} modal.__trap = null; modal.__prevFocus = null; } } });
})();
