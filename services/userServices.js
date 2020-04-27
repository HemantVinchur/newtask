const functions = require('../function');
const user = require('../models/user');
const product = require('../models/product');
const userAuth = require('../models/userAuth');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
//......................................................User onboard started.................................................................................................................................................................................................................................................



const userSignup = async(payLoad) => {
    try {
        console.log(payLoad)
        let findData = await user.findOne({ email: payLoad.email });
        console.log(findData)
        let mobileData = await user.findOne({ contact: payLoad.contact });
        let hashObj = functions.hashPassword(payLoad.password)
        console.log(hashObj)
        delete payLoad.password
        payLoad.salt = hashObj.salt
        payLoad.password = hashObj.hash
        if (!findData) {
            if (!mobileData) {
                data = { firstName: payLoad.firstName, lastName: payLoad.lastName, email: payLoad.email, contact: payLoad.contact, salt: payLoad.salt, password: payLoad.password }
                var userData = await user.create(data);
                console.log(userData)
            }
        } else {
            console.log("User already signup")
        }
        console.log(userData)
        return { userData, findData, mobileData };
    } catch (error) {
        console.error(error)
        throw error
    }
}


//Signin:-

const userSignIn = async(payLoad) => {

    try {
        let data = await user.findOne({ email: payLoad.username });
        let authData = await userAuth.findOne({ username: payLoad.username });
        console.log(data)
        if (!data) {
            console.log("User not found")
        } else {
            var isPasswordValid = functions.validatePassword(data.salt, payLoad.password, data.password);
            console.log(isPasswordValid)
        }
        if (!isPasswordValid) {
            console.log("Incorrect password")
        } else if (authData) {
            console.log("Access token is already created.")
            var userInfo = { firstName: data.firstName, lastName: data.lastName, email: data.email, mobile: data.mobile, accessToken: authData.accessToken }
        } else {
            let token = jwt.sign({ email: payLoad.username }, 's3cr3t');
            console.log("Token-:", token)
            var userData = await userAuth.create({ username: payLoad.username, accessToken: token });
            var userInfo = { firstName: data.firstName, lastName: data.lastName, email: data.email, mobile: data.mobile, accessToken: userData.accessToken }
        }
        return { data, isPasswordValid, userInfo, authData }
    } catch (error) {
        console.log(error)
        throw error
    }
}


//Reset password:-

const resetPassServices = async(payLoad, token) => {
    try {
        let find = await userAuth.findOne({ accessToken: token });
        if (find.username) {
            var findData = await user.findOne({ email: find.username });
            if (!findData) {
                return "User does not exist"
            } else {
                if (payLoad.password == payLoad.confirmPassword) {
                    let hashObj = functions.hashPassword(payLoad.password);
                    console.log(hashObj)
                    delete password;
                    payLoad.salt = hashObj.salt;
                    payLoad.password = hashObj.hash;
                    var updateData = await user.updateOne({ email: find.username }, {
                        $set: {
                            password: payLoad.password,
                            salt: payLoad.salt
                        }
                    }, { new: true });
                } else {
                    var confirm = "Confirm password is not correct"
                }
            }
        } else {
            return "User does not exists"
        }
        return { updateData, findData, confirm };
    } catch (error) {
        console.error(error);
        throw error;
    }
}


//Add product

const addProduct = async(payLoad) => {
    try {
        let userData = await product.create(payLoad);
        return userData
    } catch (error) {
        console.error(error)
        throw error;
    }
}


//List of products

const getProducts = async(token) => {
    console.log("Get user history")
    try {
        console.log("getUserHistory")
        var findData = await userAuth.findOne({ accessToken: token });
        var userData = await product.find();
        console.log(userData)
        console.log(userData.length)
        if (!userData.length) {
            var empty = "Produt is empty"
            return { empty }
        } else {
            return { userData };
        }
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//User Logout

const userLogout = async(token) => {
    try {
        let decodeCode = await functions.authenticate(token)
        if (!decodeCode) {
            console.log("Access token not found")
        }
        token.accessToken = decodeCode.accessToken
        let deletetoken = await userAuth.deleteOne(token.accessToken)
        return deletetoken
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = { userSignup, userSignIn, resetPassServices, addProduct, getProducts, userLogout }