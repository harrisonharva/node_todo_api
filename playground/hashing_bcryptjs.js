const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "passwordabc!";

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = "$2a$10$28QL5gZDxBlvxAc3jddGSe3gkd3TzcafHC1pnbpGD23uTx30Ujdgu";

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});
