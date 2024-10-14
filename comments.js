// Create web server
// npm install express
// npm install body-parser
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Get data from file
var comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));

// Get all comments
app.get('/comments', function(req, res) {
    res.json(comments);
});

// Get a comment
app.get('/comments/:id', function(req, res) {
    var id = req.params.id;
    var comment = comments.find(function(comment) {
        return comment.id == id;
    });
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).end();
    }
});

// Add a new comment
app.post('/comments', function(req, res) {
    var comment = req.body;
    var id = comments.length + 1;
    comment.id = id;
    comments.push(comment);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.status(201).json(comment);
});

// Update a comment
app.put('/comments/:id', function(req, res) {
    var id = req.params.id;
    var comment = comments.find(function(comment) {
        return comment.id == id;
    });
    if (comment) {
        comment.name = req.body.name;
        comment.email = req.body.email;
        comment.message = req.body.message;
        fs.writeFileSync('comments.json', JSON.stringify(comments));
        res.json(comment);
    } else {
        res.status(404).end();
    }
});

// Delete a comment
app.delete('/comments/:id', function(req, res) {
    var id = req.params.id;
    var index = comments.findIndex(function(comment) {
        return comment.id == id;
    });
    if (index != -1) {
        comments.splice(index, 1);
        fs.writeFileSync('comments.json', JSON.stringify(comments));
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

app.listen(3000, function() {
    console.log('Server is running on port 3000');
});