// index.js

const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const port = 3000;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'forum_db',
    insecureAuth: true,
});



app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

const checkLoggedIn = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Navigation links
const navLinks = [
    { path: '/', text: 'Home' },
    { path: '/about', text: 'About' },
    { path: '/posts', text: 'Posts' },
    { path: '/add-post', text: 'Add Post', loggedIn: true }, // Only show if logged in
    { path: '/register', text: 'Register', loggedOut: true }, // Only show if logged out
    { path: '/login', text: 'Login', loggedOut: true }, // Only show if logged out
    { path: '/logout', text: 'Logout', loggedIn: true } // Only show if logged in
];

app.use((req, res, next) => {
    res.locals.navLinks = navLinks.map(link => ({ ...link, active: req.path === link.path }));
    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/posts', checkLoggedIn, (req, res) => {
    connection.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.user_id', (error, results) => {
        if (error) throw error;
        res.render('posts', { posts: results });
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
            if (error) throw error;

            res.redirect('/login');
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;

                if (result) {
                    req.session.userId = user.user_id;
                    req.session.user = user.username;

                    res.redirect('/');
                } else {
                    res.redirect('/login');
                }
            });
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/add-post', checkLoggedIn, (req, res) => {
    res.render('add-post');
});

app.post('/add-post', checkLoggedIn, (req, res) => {
    const { text } = req.body;
    const userId = req.session.userId;

    connection.query('INSERT INTO posts (user_id, text) VALUES (?, ?)', [userId, text], (error, results) => {
        if (error) throw error;
        res.redirect('/posts');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
