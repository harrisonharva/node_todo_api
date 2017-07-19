// const mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDb Server');
    }
    console.log('Connected to MongoDb Server');

    // db.collection('todos').find({
    //     _id: new ObjectID('596f56786b43a2228de53a9e'),
    // }).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 4));
    // }, (err) => {
    //     console.log('Unable to fetch todos from the database', err);
    // });

    // db.collection('todos').find().count().then((count) => {
    //     console.log(`Todos count:${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos from the database', err);
    // });

    db.collection('users').find({
        name: 'testUser4',
    }).toArray().then((docs) => {
        console.log('Todos:');
        console.log(JSON.stringify(docs, undefined, 4));
    }, (err) => {
        console.log('Unable to fetch todos from the database', err);
    });

    db.close();
});
