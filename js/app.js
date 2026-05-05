// ==============================
// CONFIG
// ==============================
const CART_STORAGE_KEY = "hiomey_cart";

// ==============================
// DOM
// ==============================
const btnCartToggle = document.getElementById("btnCartToggle");
const btnCartClose = document.getElementById("btnCartClose");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");

const btnMenuToggle = document.getElementById("btnMenuToggle");
const mainNavMobile = document.getElementById("mainNavMobile");

// ==============================
// STATE
// ==============================
let cartItems = [];

// ==============================
// LOCAL STORAGE
// ==============================
function persistCart() {
  if (!cartItems.length) {
    localStorage.removeItem(CART_STORAGE_KEY);
    return;
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function loadCartFromStorage() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  if (!data) return;

  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      cartItems = parsed;
    }
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
}

// ==============================
// UI CONTROL
// ==============================
function openCart() {
  cart?.classList.add("cart--open");
  overlay?.classList.add("overlay--visible");
}

function closeCart() {
  cart?.classList.remove("cart--open");
  if (!mainNavMobile?.classList.contains("header__nav--open")) {
    overlay?.classList.remove("overlay--visible");
  }
}

function toggleMenu() {
  mainNavMobile?.classList.toggle("header__nav--open");
  overlay?.classList.toggle("overlay--visible");
}

// ==============================
// CARRITO LÓGICA
// ==============================
function calculateTotals() {
  let total = 0;
  let count = 0;

  cartItems.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
  });

  return { total, count };
}

function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
  } else {
    cartItems.forEach(item => {
      const el = document.createElement("div");

      el.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; border-bottom:1px solid #eee; padding:10px 0;">
          
          <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" />

          <div style="flex:1;">
            <strong>${item.name}</strong><br>
            <small>S/ ${item.price.toFixed(2)}</small>

            <div style="margin-top:5px;">
              <button class="boton-1" data-action="decrease" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="boton-1" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>

          <div style="text-align:right;">
            <p>S/ ${(item.price * item.qty).toFixed(2)}</p>
            <button class="boton-2" data-action="remove" data-id="${item.id}">❌</button>
          </div>

        </div>
      `;

      cartItemsContainer.appendChild(el);
    });
  }

  const { total, count } = calculateTotals();

  if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
  if (cartCountEl) cartCountEl.textContent = count;
}

function addToCart(id, name, price, image) {
  const existing = cartItems.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({
      id,
      name,
      price: parseFloat(price),
      qty: 1,
      image
    });
  }

  persistCart();
  renderCart();

  // 🔥 NUEVO
  showToast("Producto agregado al carrito");

  const cartBtn = document.getElementById("btnCartToggle");

  cartBtn?.classList.add("cart-bounce");

  setTimeout(() => {
    cartBtn?.classList.remove("cart-bounce");
  }, 300);
}

function updateQuantity(id, change) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cartItems = cartItems.filter(i => i.id !== id);
  }

  persistCart();
  renderCart();
}

function removeItem(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  persistCart();
  renderCart();
}

// ==============================
// EVENTOS
// ==============================

// abrir carrito
btnCartToggle?.addEventListener("click", e => {
  e.stopPropagation();
  openCart();
});

btnCartClose?.addEventListener("click", closeCart);

// menú
btnMenuToggle?.addEventListener("click", e => {
  e.stopPropagation();
  toggleMenu();
});

// overlay
overlay?.addEventListener("click", () => {
  closeCart();
  mainNavMobile?.classList.remove("header__nav--open");
  overlay?.classList.remove("overlay--visible");
});

// click fuera carrito
document.addEventListener("click", (e) => {
  const insideCart = cart?.contains(e.target);
  const btn = btnCartToggle?.contains(e.target);

  if (!insideCart && !btn) {
    closeCart();
  }
});

// ==============================
// EVENTOS DINÁMICOS (TODO EN UNO)
// ==============================
// ==============================
// EVENTOS DINÁMICOS (TODO EN UNO)
// ==============================
document.addEventListener("click", (e) => {

  // agregar producto
  const addBtn = e.target.closest(".add-to-cart");
  if (addBtn) {
    addToCart(
      addBtn.dataset.id,
      addBtn.dataset.name,
      addBtn.dataset.price,
      addBtn.dataset.image
    );
  }

  // acciones carrito
  const actionBtn = e.target.closest("[data-action]");
  if (actionBtn) {
    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;

    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeItem(id);
  }

  // ✅ VACIAR CARRITO (BIEN HECHO)
  if (e.target.id === "vaciarCarrito") {
    if (confirm("¿Seguro que deseas vaciar el carrito?")) {
    cartItems = [];
    persistCart();
    renderCart();
    showToast("Carrito vaciado");
    }
  }

});

// ==============================
// CARGAR PRODUCTOS
// ==============================
const contenedor = document.getElementById("productsGrid");

if (contenedor) {
  fetch('http://localhost:3000/productos')
    .then(res => res.json())
    .then(data => {

      contenedor.innerHTML = "";

      data.forEach(producto => {
        contenedor.innerHTML += `
          <article class="product-card">
            <img src="${producto.imagen}" class="product-card__img" />
            <h3>${producto.nombre}</h3>
            <p>S/ ${producto.precio}</p>
            <button class="btn-secondary add-to-cart"
              data-id="${producto.id}"
              data-name="${producto.nombre}"
              data-price="${producto.precio}"
              data-image="${producto.imagen}">
              Agregar al carrito
            </button>
          </article>
        `;
      });

    });
}

// ==============================
// INIT
// ==============================
loadCartFromStorage();
renderCart();

document.querySelector(".cart__checkout")?.addEventListener("click", () => {

  if (cartItems.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje = "🛒 *Pedido HIOMEY* %0A%0A";

  cartItems.forEach(item => {
    mensaje += `• ${item.name} x${item.qty} - S/ ${(item.price * item.qty).toFixed(2)}%0A`;
  });

  const { total } = calculateTotals();

  mensaje += `%0A💰 *Total: S/ ${total.toFixed(2)}*`;

  const numero = "51960357877"; // 🔴 CAMBIA POR TU NÚMERO

  const url = `https://wa.me/${numero}?text=${mensaje}`;

  window.open(url, "_blank");

  cartItems = [];
  persistCart();
  renderCart();

});

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}