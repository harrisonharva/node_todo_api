const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res, next) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        // console.log("Todo saved successfully:",doc);
        res.json(doc);
    }).catch((err) => {
        // console.log("Unable to save todo:",err);
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(
        (todos)=> {
            res.send({todos});
        },
        (err) => {
            res.status(400).send(err);
        }
    );
});

app.listen(port,() => {
    console.log('Server started on port : ', port);
});

module.exports = {app}
