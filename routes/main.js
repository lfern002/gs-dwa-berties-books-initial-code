// main.js

module.exports = function (app, connection) {
    // Display forum topics
    app.get('/forum', (req, res) => {
        // Fetch forum topics from the database and render forum page (forum.ejs)
        connection.query('SELECT * FROM forum_topics', (error, results) => {
            if (error) throw error;
            res.render('forum', { topics: results, user: req.session.user });
        });
    });

    // Display posts within a forum topic
    app.get('/forum/:topicId', (req, res) => {
        const topicId = req.params.topicId;

        // Fetch posts for the specified topic from the database
        connection.query('SELECT * FROM forum_posts WHERE topic_id = ?', [topicId], (error, results) => {
            if (error) throw error;
            res.render('forum-topic', { posts: results, user: req.session.user });
        });
    });

    // Add a new forum topic
    app.get('/add-topic', checkLoggedIn, (req, res) => {
        res.render('add-topic');
    });

    app.post('/add-topic', checkLoggedIn, (req, res) => {
        const { title, content } = req.body;

        // Insert a new topic into the database
        connection.query('INSERT INTO forum_topics (title, content) VALUES (?, ?)', [title, content], (error, results) => {
            if (error) throw error;
            res.redirect('/forum');
        });
    });

    // Add a new post to a forum topic
    app.get('/add-post/:topicId', checkLoggedIn, (req, res) => {
        const topicId = req.params.topicId;
        res.render('add-post', { topicId });
    });

    app.post('/add-post/:topicId', checkLoggedIn, (req, res) => {
        const { text } = req.body;
        const userId = req.session.userId;
        const topicId = req.params.topicId;

        // Insert a new post into the database for the specified topic
        connection.query('INSERT INTO forum_posts (topic_id, user_id, text) VALUES (?, ?, ?)', [topicId, userId, text], (error, results) => {
            if (error) throw error;
            res.redirect(`/forum/${topicId}`);
        });
    });
};
