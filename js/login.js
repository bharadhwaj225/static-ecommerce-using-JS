import { users } from './data.js';

if (localStorage.getItem('loggedInUser')) {
    window.location.href = 'home.html';
}

const checkCredentials = (email, password) =>
    users.find(u => u.email === email && u.passkey === password);

document.getElementById('showpass').addEventListener('change', (e) => {
    document.getElementById('password').type = e.target.checked ? 'text' : 'password';
});

document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = event.target.username;
    const passwordInput = event.target.password;
    const message = document.getElementById('user-message');
    let isSuccess = false;

    const reset = () => {
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
    };

    if (!emailInput.value && !passwordInput.value) {
        message.textContent = 'Please enter email and password';
        emailInput.style.borderColor = 'red';
        passwordInput.style.borderColor = 'red';
    } else if (!emailInput.value) {
        message.textContent = 'Please enter your email';
        emailInput.style.borderColor = 'red';
        passwordInput.style.borderColor = '';
    } else if (!passwordInput.value) {
        message.textContent = 'Please enter your password';
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = 'red';
    } else {
        reset();
        const user = checkCredentials(emailInput.value, passwordInput.value);
        if (user) {
            message.textContent = 'Login successful!';
            isSuccess = true;
            localStorage.setItem('loggedInUser', user.email);
            localStorage.setItem('loggedInUserName', user.name);
            setTimeout(() => { window.location.href = 'home.html'; }, 400);
        } else {
            message.textContent = 'Invalid email or password';
        }
    }

    message.className = '';
    message.classList.add(isSuccess ? 'success' : 'error');
});
