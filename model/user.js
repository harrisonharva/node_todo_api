var mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        // validate: [ email, 'Invalid email' ]
    },
    age: {
        type: Number,
        required: 'Age is required',
        // validate: [ validator.isNumber, 'Invalid age' ]
    },
    location: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    createdAt: {
        type: Date,
        expires: 60*60*24
    }
});

module.exports = {User};
