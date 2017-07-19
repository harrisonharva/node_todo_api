// const mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDb Server');
    }
    console.log('Connected to MongoDb Server');

    // deleteMany
    // db.collection('todos').deleteMany({
    //     name: 'Meeting for x',
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to delete todos from the database', err);
    // });

    // deleteOne
    // db.collection('todos').deleteOne({
    //     text: 'Meeting for x',
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to delete todos from the database', err);
    // });

    // findOneAndDelete
    // db.collection('todos').findOneAndDelete({
    //     text: 'Meeting for x',
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log('Unable to delete todos from the database', err);
    // });

    db.collection('users').deleteMany({
        name: 'testUser9'
    });

    db.collection('users').findOneAndDelete({
        _id: new ObjectID('596f5a7e7eda5b2bb2e89e25')
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete todos from the database', err);
    });
    db.close();
});
