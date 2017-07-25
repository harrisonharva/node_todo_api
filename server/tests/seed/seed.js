const {ObjectID} = require('mongodb');
const {Todo} = require('./../../model/todo');
const {User} = require('./../../model/user');
const jwt = require('jsonwebtoken');

// Initial test data of todos
const todos = [{
    "_id": new ObjectID(),
    "text" : "This is first todo123",
    "completed": true,
    "completedAt": 333
}, {
    "_id": new ObjectID(),
    "text" : "This is second todo456",
    "completed": false,
    "completedAt": 444
}, {
    "_id": new ObjectID(),
    "text" : "This is third todo789",
    "completed": true,
    "completedAt": 555
}];

// Initial test data of users
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const users = [{
    "_id": userOneId,
    "name":"testUser1",
    "email":"test1@example.com",
    "password":"userOnePass",
    "age":24,
    "location":"testLocation1",
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({_id: userOneId, access: 'auth'}, 'testSecretKey').toString()
    }]
},
{
    "_id": userTwoId,
    "name":"testUser2",
    "email":"test2@example.com",
    "password":"testpassword2",
    "age":21,
    "location":"testLocation2",
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({_id: userTwoId, access: 'auth'}, 'testSecretKey').toString()

    }]
},
{
    "_id": userThreeId,
    "name":"testUser3",
    "email":"test3@example.com",
    "password":"testpassword3",
    "age":27,
    "location":"testLocation3",
    "tokens": [{
        "access": 'auth',
        "token": jwt.sign({_id: userThreeId, access: 'auth'}, 'testSecretKey').toString()

    }]
}
];

// Used to perform task before each test case run
const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        var userThree = new User(users[2]).save();
        return Promise.all([userOne, userTwo, userThree]);
    })
    .then(() => done())
    .catch((err) => done(err));
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
