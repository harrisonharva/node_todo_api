const mongoose = require('mongoose');
// const {email} = require('validator');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todoapp', {
    useMongoClient: true,
}).then(
    (result) => { console.log('Database Connected successfully'); },
    (err) => { console.log('Unable to connect to the database'); }
);

module.exports = {
    mongoose: mongoose
}
