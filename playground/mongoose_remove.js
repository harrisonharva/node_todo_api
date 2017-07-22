const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: "5971eeab4bc529378db54248"}).then((todo) => {
    console.log(todo);
});

// Todo.findByIdAndRemove("5971eeab4bc529378db54249").then((todo) => {
//     console.log(todo);
// });
