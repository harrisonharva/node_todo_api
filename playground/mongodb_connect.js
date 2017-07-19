// const mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDb Server');
    }
    console.log('Connected to MongoDb Server');

    // db.collection('todos').insertOne({
    //     text: 'Something to do 1',
    //     compelted: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    // db.collection('users').insertOne({
    //     name: 'testUser9',
    //     age: 26,
    //     location: 'Santa clara, CA, USA'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 4));
    //     console.log(result.ops[0]._id);
    //     console.log((result.ops[0]._id).getTimestamp());
    // });
    db.close();
});
