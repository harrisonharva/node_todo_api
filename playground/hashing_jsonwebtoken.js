const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 4
}
var token = jwt.sign(data, 'somesecretkey');
console.log(token);

var decodedResult = jwt.verify(token, 'somesecretkey');
console.log('DecodedResult:'+JSON.stringify(decodedResult, undefined, 4));

// var message = "something user 123";
//
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`HASH: ${hash}`);
//
// var data = {
//     id: 4
// }
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }
//
// //To attack and delete other user's data
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
//
// if(resultHash === token.hash) {
//     console.log('Data was not changed and it is correct so no compromised data');
// } else {
//     console.log('Data was changed and it is compromised data so Do not trust!!!');
// }
