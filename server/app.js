const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./database');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

app.use(session({
    secret: 'nora-deli-secret',
    resave: false,
    saveUninitialized: false
}));

// registrering
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Alla fält måste vara ifyllda' });
    }
    if (password.length < 6) {
        return res.json({ success: false, message: 'Lösenordet måste vara minst 6 tecken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.json({ success: false, message: 'E-post används redan' });
                }
                return res.json({ success: false, message: 'Något gick fel' });
            }
            res.json({ success: true });
        }
    );
});

// inloggning
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // hämta användaren från databasen med email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.json({ success: false, message: 'Fel e-post eller lösenord' });
        }

        const user = results[0];

        // jämför lösenordet med det hashade lösenordet i databasen
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.json({ success: false, message: 'Fel e-post eller lösenord' });
        }

        // sparar användarens id i sin session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.is_admin
        };

        res.json({ success: true, user: req.session.user });
    });
});

// kollar om användaren är inloggad
app.get('/api/user-check', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// logga ut
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// lägger till favorit
app.post('/api/favorites/add', (req, res) => {
    const { itemId } = req.body;

    // kollar så att användaren är inloggad
    if (!req.session.user) {
        return res.json({ success: false, message: 'Du behöver vara inloggad' });
    }

    const userId = req.session.user.id;

    db.query('INSERT IGNORE INTO favorites (user_id, menu_item_id) VALUES (?, ?)', [userId, itemId], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

// tar bort favorit
app.post('/api/favorites/remove', (req, res) => {
    const { itemId } = req.body;

    // kollar så att användaren är inloggad
    if (!req.session.user) {
        return res.json({ success: false, message: 'Du behöver vara inloggad' });
    }

    const userId = req.session.user.id;

    db.query('DELETE FROM favorites WHERE user_id = ? AND menu_item_id = ?', [userId, itemId], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

server.listen(3000, () => {
    console.log('Server körs på http://localhost:3000');
});