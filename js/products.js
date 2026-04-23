import { requireAuth, logout } from './auth.js';
import { addToCart, getCartCount } from './cart-utils.js';

requireAuth();

const cartCountEl = document.getElementById('cart-count');
cartCountEl.textContent = getCartCount() || '';
document.getElementById('logout-btn').addEventListener('click', logout);

const grid = document.getElementById('product-grid');
const filtersEl = document.getElementById('filters');
let allProducts = [];
let activeCategory = 'all';

const updateCartBadge = () => {
    const count = getCartCount();
    cartCountEl.textContent = count || '';
};

const renderProducts = () => {
    const filtered = activeCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <span class="product-category">${p.category}</span>
            <div class="product-title">${p.title}</div>
            <div class="product-price">$${p.price.toFixed(2)}</div>
            <button class="add-btn" data-id="${p.id}">Add to Cart</button>
        </div>
    `).join('');

    grid.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = allProducts.find(p => p.id === Number(btn.dataset.id));
            addToCart(product);
            updateCartBadge();
            btn.textContent = 'Added!';
            btn.classList.add('added');
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.classList.remove('added');
                btn.disabled = false;
            }, 1000);
        });
    });
};

const renderFilters = () => {
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    filtersEl.innerHTML = categories.map(cat => `
        <button class="filter-btn${cat === activeCategory ? ' active' : ''}" data-cat="${cat}">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
    `).join('');

    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.cat;
            renderFilters();
            renderProducts();
        });
    });
};

grid.innerHTML = '<p class="status-msg">Loading products...</p>';

fetch('https://fakestoreapi.com/products')
    .then(r => {
        if (!r.ok) throw new Error('Network response error');
        return r.json();
    })
    .then(data => {
        allProducts = data;
        renderFilters();
        renderProducts();
    })
    .catch(() => {
        grid.innerHTML = '<p class="status-msg">Failed to load products. Please check your connection and try again.</p>';
    });
