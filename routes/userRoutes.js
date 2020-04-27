const router = require('express').Router();
const jwt = require('jsonwebtoken');
const stripe = require("stripe");
const functions = require('../function');
const userValidator = require('../validators/userValidator');
const services = require('../services/userServices');


//Signup

router.post('/signup', userValidator.signupReqValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignup(payLoad);
            console.log(newData)
            if (newData.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Signup successful",
                    data: newData.userData
                })
            } else if (newData.findData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Email already exists",
                    data: {}
                })
            } else if (newData.mobileData) {
                return res.status(200).json({
                    statusCode: 403,
                    message: "Mobile no. already exists",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 403,
                    message: "User already registered",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 500,
                message: "Signup unsuccessful",
                data: {}
            })
        }

    })


//Signin

router.post('/signin', userValidator.signinReqValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let newData = await services.userSignIn(payLoad);
            console.log(newData)
            console.log(newData.data)
            if (newData.userInfo) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "SignIn successful",
                    data: newData.userInfo
                })
            } else if (!newData.data) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User not found",
                    data: {}
                })
            } else if (!newData.isPasswordValid) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Incorrect password",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Signin unsuccessful",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error)
            res.status(200).json({
                statusCode: 400,
                message: "Signin unsuccessful",
                data: {}
            })
        }

    })


//User reset password
router.post('/resetPassword', userValidator.resetPasswordValidator,
    async(req, res) => {
        try {

            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token)
            let decodeCode = await functions.authenticate(token)
            if (!decodeCode) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            token.accessToken = decodeCode.accessToken
            let payLoad = req.body;
            let newData = await services.resetPassServices(payLoad, token);
            console.log(newData)
            if (newData.updateData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Password successfully updated",
                    data: newData.updateData
                })
            } else if (!newData.findData) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "User does not exists",
                    data: {}
                })
            } else if (newData.confirm) {
                return res.status(200).json({
                    statusCode: 401,
                    message: "Confirm password is not correct",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Password does not updated",
                    data: {}
                })
            }
        } catch (error) {
            console.log(error);
            res.status(200).json({
                statusCode: 400,
                message: "Password does not updated",
                data: {}
            })
        }
    })


//Add product

router.post('/product', userValidator.addProductValidator,
    async(req, res) => {
        try {
            let payLoad = req.body;
            let userData = await services.addProduct(payLoad);
            return res.status(200).json({
                statusCode: 200,
                message: "Product successfully added",
                data: userData
            })

        } catch (error) {
            res.status(200).json({
                statusCode: 400,
                message: "Somthing went wrong.",
                data: {}
            })


        }

    })


//List of products

router.get('/getProducts',
    async(req, res) => {
        try {
            var data = await services.getProducts();
            console.log(data.userData)
            if (data.userData) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "List of products successfully fetched",
                    data: data.userData
                })
            } else if (data.empty) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Products does not present",
                    data: {}
                })
            } else {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Products does not present",
                    data: {}
                })
            }
        } catch (error) {
            res.status(200).json({
                statusCode: 401,
                message: "Internal error, please check access token",
                data: {}
            })

        }

    })

const keyPublishable = 'pk_test_mT8LPEPrpEHVaIMCv2MMx0Vv00y3h5aEPH';
const keySecret = 'sk_test_3dMQ4Wxaq3hiVw9mr9lsCs5E00qRhKXs9q';

router.post("/charge", function(req, res) {

    let amount = 5 * 100; // 500 cents means $5 

    // create a customer 
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            }));

});

//User Logout

router.post('/logout',
    async(req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(200).json({
                    statusCode: 404,
                    message: "Access Token not found",
                    data: {}
                })
            }
            let token = req.headers.authorization.split(' ')[1];
            console.log(token);

            let data = await services.userLogout(token);
            if (data) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Logout successful",
                    data: data
                })
            } else {
                return res.status(200).json({
                    statusCode: 400,
                    message: "Logout unsuccessful",
                    data: data
                })
            }
        } catch (error) {
            return res.status(200).json({
                statusCode: 401,
                message: "Access token is not correct",
                data: {}
            })
        }
    })

module.exports = router;