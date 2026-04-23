import { requireAuth, logout } from './auth.js';
import { getCartCount } from './cart-utils.js';

requireAuth();

const count = getCartCount();
document.getElementById('cart-count').textContent = count || '';

document.getElementById('logout-btn').addEventListener('click', logout);

const name = localStorage.getItem('loggedInUserName') || localStorage.getItem('loggedInUser');
document.getElementById('user-greeting').textContent = `Welcome back, ${name}`;
