import { requireAuth, logout } from './auth.js';
import { getCart, saveCart, getCartCount } from './cart-utils.js';

requireAuth();

document.getElementById('logout-btn').addEventListener('click', logout);

const cartContainer = document.getElementById('cart-container');

const renderCart = () => {
    const cart = getCart();
    const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

    document.getElementById('cart-count').textContent = totalQty || '';
    document.getElementById('item-count').textContent =
        totalQty === 0 ? '' : `${totalQty} item${totalQty !== 1 ? 's' : ''}`;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty.</p>
                <a href="products.html">Continue shopping &rarr;</a>
            </div>`;
        return;
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    cartContainer.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                    <tr data-id="${item.id}">
                        <td><img src="${item.image}" alt="${item.title}"></td>
                        <td class="item-info"><div class="title">${item.title}</div></td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>
                            <div class="qty-controls">
                                <button class="qty-btn dec-btn">&minus;</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn inc-btn">+</button>
                            </div>
                        </td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        <td><button class="remove-btn">Remove</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="cart-summary">
            <div class="summary-box">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <button class="checkout-btn">Place Order</button>
                <a href="products.html" class="continue-link">&larr; Continue Shopping</a>
            </div>
        </div>
    `;

    cartContainer.querySelectorAll('tr[data-id]').forEach(row => {
        const id = Number(row.dataset.id);

        row.querySelector('.inc-btn').addEventListener('click', () => {
            const c = getCart();
            const item = c.find(i => i.id === id);
            if (item) item.quantity += 1;
            saveCart(c);
            renderCart();
        });

        row.querySelector('.dec-btn').addEventListener('click', () => {
            const c = getCart();
            const item = c.find(i => i.id === id);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                saveCart(c);
            } else {
                saveCart(c.filter(i => i.id !== id));
            }
            renderCart();
        });

        row.querySelector('.remove-btn').addEventListener('click', () => {
            saveCart(getCart().filter(i => i.id !== id));
            renderCart();
        });
    });

    cartContainer.querySelector('.checkout-btn').addEventListener('click', () => {
        if (confirm('Place your order now?')) {
            saveCart([]);
            alert('Order placed! Thank you for your purchase.');
            renderCart();
        }
    });
};

renderCart();
