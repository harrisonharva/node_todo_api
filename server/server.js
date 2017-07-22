var env = process.env.NODE_ENV || 'development';
console.log(`Environment ************************* ${env}`);
if(env == 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoapp'
} else {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/todoappTest'
}
//var config = require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

/**
 * POST /todo
 * Save todo data
 * @object {Todo}
 */
app.post('/todos', (req, res, next) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        // Todo saved successfully
        res.json(doc);
    }).catch((err) => {
        // Unable to save todo
        res.status(400).send(err);
    });
});

/**
 * GET /todos
 * Get all todos
 * @type {[type]}
 */
app.get('/todos', (req, res) => {
    Todo.find().then(
        (todos)=> {
            // Todo fetched successfully and send it back as a response
            res.send({todos});
        },
        (err) => {
            // Bad request so sending bad response
            res.status(400).send(err);
        }
    );
});

//
/**
 * GET /todos/123456
 * Get todo by id
 * @type {[type]}
 */
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            //return res.status(404).send('Id Not Found');
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

/**
 * DELETE /todos/:id
 * Delete todo by id
 * @type {[type]}
 */
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

/**
 * PATCH /todos/:id
 * Update todo by id
 * @type {[type]}
 */
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed'])
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    if( (_.isBoolean(body.completed)) && (body.completed) ) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((error) => {
        res.status(400).send();
    });
});

app.listen(port,() => {
    console.log(`Server started on port : ${port}`);
});

module.exports = {app}
