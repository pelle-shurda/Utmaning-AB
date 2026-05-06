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

server.listen(3000, () => {
    console.log('Server körs på http://localhost:3000');
});