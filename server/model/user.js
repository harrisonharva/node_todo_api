const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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
        unique : true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
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

/**
 * Used to override object.json data to send custom data from user object instead of all user's information
 * @return {object} [user object with minimal user data]
 */
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

/**
 * [Method is useful to generate user auth token for user authentication]
 * @return {[string]} [Returns token String which is user auth token]
 */
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'testSecretKey').toString();
    user.tokens.push({access, token});
    return user.save().then((savedUserData) => {
        // console.log("User saved successfully -> token:"+JSON.stringify(token, undefined, 4));
        // console.log("User saved successfully -> savedUserData:"+JSON.stringify(savedUserData, undefined, 4));
        return token;
    }, (err) => {
        console.log('Unable to store userAuthToken:'+JSON.stringify(err, undefined, 4));
    });
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'testSecretKey');
        console.log("Decoded token:"+JSON.stringify(decoded, undefined, 4));
    } catch(e) {
        console.log("Error: Token unhashing issue:"+e);
        return Promise.reject();
    }
    var userdata = User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
    return userdata;
};

UserSchema.pre('save', function(next) {
    var user = this;
    try {
        if(user.isModified('password')) {
            bcrypt.genSalt(10, (err, salt) => {
                // console.log('Generating and hashing user password to store in the database');
                bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash;
                    // console.log('User hashed password:'+user.password);
                    next();
                });
            });
        } else {
            console.log("From else block in the pre.save()");
            next();
        }
    } catch(e) {
        console.log("Error in processing password hashing:"+e);
        next();
    }
});

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({"email":email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            // Compare hashed password from the database object and return data accordingly
            bcrypt.compare(password, user.password, (error, result) => {
                if(result == false) {
                    reject();
                } else {
                    resolve(user);
                }
            });
        });
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = {User};
