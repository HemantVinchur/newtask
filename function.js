const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const hashPassword = (password) => {
    let obj = {};
    obj.salt = crypto.randomBytes(16).toString('hex');
    obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000, 64, `sha512`).toString('hex');
    return obj;
}

const validatePassword = (salt, password, hashPassword) => {
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex');
    return hash === hashPassword;
}

const authenticate = (token) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, 's3cr3t', (error, decoded) => {
            if (error) {
                console.error(error);
                reject(error);
            }
            resolve(decoded)
        })
    })
}

module.exports = {
    hashPassword,
    validatePassword,
    authenticate
}