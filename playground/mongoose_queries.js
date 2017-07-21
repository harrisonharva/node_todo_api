const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

var id = '5971b54094513159d60d035a111';

// if(!ObjectID.isValid(id)) {
//     return console.log('ID not valid');
// }

// Todo.find({
//     _id: id,
// }).then((todos) => {
//     if(todos.length == 0) {
//         return console.log('Todo Id Not found');
//     }
//     console.log('Todos:', todos);
// }).catch((err) => console.log(err));
//
// Todo.findOne({
//     _id: id,
// }).then((todo) => {
//     if(!todo) {
//         return console.log('Todo Id Not found');
//     }
//     console.log('Todo:', todo);
// }).catch((err) => console.log(err));
//
// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Todo Id Not found');
//     }
//     console.log('Todo by Id:', todo);
// }).catch((err) => console.log(err));

User.find({
    email: 'test@example.com',
}).then((users) => {
    if(users.length == 0) {
        return console.log('User\'s emailid Not found');
    }
    console.log('Users:', users);
}).catch((err) => console.log(err));

User.findOne({
    email: 'test@example.com',
}).then((user) => {
    if(!user) {
        return console.log('User\'s emailid Not found');
    }
    console.log('User:', user);
}).catch((err) => console.log(err));

User.findById('5970f845e7991f13c2204572').then((user) => {
    if(!user) {
        return console.log('Todo Id Not found');
    }
    console.log('User by Id:', user);
    console.log(JSON.stringify(user, undefined, 4));
}).catch((err) => console.log(err));
