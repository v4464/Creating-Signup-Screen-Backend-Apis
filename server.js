// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vaibhav@123',
    database: 'expense'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            res.status(500).send('Failed to sign up');
            throw err;
        }

        if (result.length > 0) {
            res.status(409).send('User already exists');
        } else {
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
                if (err) {
                    res.status(500).send('Failed to sign up');
                    throw err;
                }
                res.status(200).send('User registered successfully');
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
