async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (data.success) {
        window.location.href = '/pages/login.html';
    } else {
        document.getElementById('error-msg').style.display = 'block';
        document.getElementById('error-msg').textContent = data.message;
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        window.location.href = '/index.html';
    } else {
        document.getElementById('error-msg').style.display = 'block';
        document.getElementById('error-msg').textContent = data.message;
    }
}

// inloggningsstatus och ändrar ikon-knappen
async function checkLogin() {
    const response = await fetch('/api/user-check');
    const data = await response.json();

    const icon = document.querySelector('.linkKonto');
    if (icon && data.loggedIn) {
        icon.href = '/pages/profile.html';
    }
}

checkLogin();