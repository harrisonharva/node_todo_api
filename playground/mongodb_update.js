// const mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDb Server');
    }
    console.log('Connected to MongoDb Server');

    // db.collection('todos').findOneAndUpdate({
    //     _id: new ObjectID('596f6be6e913d2aea734c01b')
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     if(err) {
    //         console.log('There is an error on updating document');
    //     }
    // });

    db.collection('users').findOneAndUpdate({
        _id: 455
    },{
        $set: {
            name: 'testUser77'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        if(err) {
            console.log('There is an error on updating document');
        }
    });
    db.close();
});
