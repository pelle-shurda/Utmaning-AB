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

// hämtar och visar användarens info på profilsidan
async function loadProfile() {
    const response = await fetch('/api/user-check');
    const data = await response.json();

    if (!data.loggedIn) {
        window.location.href = '/pages/login.html';
        return;
    }

    // sätter användarens namn som rubrik och visar emailet och namnet i profilen
    document.getElementById('profil-rubrik').textContent = data.user.name;
    document.getElementById('profil-email').textContent = data.user.email;
    document.getElementById('profil-namn').textContent = data.user.name;
}

// logga ut
async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/index.html';
}

// kör loadProfile om man är inne på profilsidan
if (window.location.pathname.includes('profile')) {
    loadProfile();
}

// klick på favorit-knappen 
async function toggleFavorite(icon) {
    const box = icon.closest('.deliMeny-box');
    const itemId = box.dataset.id;

    const response = await fetch('/api/user-check');
    const data = await response.json();

    // man skickas till login om inte inloggad
    if (!data.loggedIn) {
        window.location.href = '/pages/login.html';
        return;
    }

    // check om den redan är favorit
    if (icon.classList.contains('favorite')) {
        await fetch('/api/favorites/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId })
        });
        icon.classList.remove('favorite');
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    } else {
        //lägger till som favorit
        await fetch('/api/favorites/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId })
        });
        icon.classList.add('favorite');
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    }
}

// läser av när man klickar på hjärta-ikonen och kör toggleFavorite
document.querySelectorAll('.heart-icon').forEach(icon => {
    icon.addEventListener('click', () => toggleFavorite(icon));
});