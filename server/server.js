const config = require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');
var {authenticate} = require('./middleware/authenticate');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

/**
 * Save todo route as a POST /todo
 * Save todo data
 * @object {Todo}
 */
app.post('/todos', authenticate, (req, res, next) => {
    var todo = new Todo({
        text: req.body.text,
        _creator_id: req.user._id
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
 * Fetch all todos route as a GET /todos
 * Get all todos
 * @type {[type]}
 */
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator_id : req.user._id
    }).then(
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
 * Fetch individual todo route by todo id as a GET /todos/123456
 * Get todo by id
 * @type {[type]}
 */
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator_id : req.user._id
    }).then((todo) => {
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
 * Remove todos route as a DELETE /todos/:id
 * Delete todo by id
 * @type {[type]}
 */
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator_id : req.user._id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

/**
 * Update todos route as a PATCH /todos/:id
 * Update todo by id
 * @type {[type]}
 */
app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate(
        {
            _id: id,
            _creator_id : req.user._id
        }, 
        {$set:body},
        {new: true}
    ).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch((error) => {
        res.status(400).send();
    });
});

/**
 * User signup route as a POST /users
 * Save user data
 * @object {User}
 */
app.post('/users', (req, res, next) => {
    var body = _.pick(req.body, ['name', 'email', 'password', 'age', 'location'])
    var user = new User(body);
    user.save().then((savedUser) => {
        // User saved successfully
        return user.generateAuthToken();
    }).then((token) => {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        console.log('************************************');
        console.log('UserToken :');
        console.log(token);
        console.log('************************************');
        res.header("x-auth", token);
        res.send(user);
    }).catch((err) => {
        // Unable to save user
        console.log("From Catch block for error"+JSON.stringify(err, undefined, 4));
        res.status(400).send(err);
    });
});

/**
 * Used to get user token
 * @type {[type]}
 */
app.get('/users/me', authenticate, (req, res, next) => {
    res.send(req.user);
});

/**
 * Used to perform user login operation
 * @type {[type]}
 */
app.post('/users/login', (req, res, next) => {
    var body = _.pick(req.body,['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

/**
 * Used to perform user logout operation
 * @type {[type]}
 */
app.delete('/users/me/token', authenticate, (req, res, next) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send();
    });
});

app.listen(port,() => {
    console.log(`Server started on port : ${port}`);
});

module.exports = {app}
