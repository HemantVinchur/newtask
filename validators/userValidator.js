const { Joi, celebrate } = require('celebrate')
const signupReqValidator = celebrate({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        contact: Joi.string().required(),
        password: Joi.string().required()
    })
})

const signinReqValidator = celebrate({
    body: Joi.object().keys({
        username: Joi.string().email().required(),
        password: Joi.string().required(),
    })
})

const resetPasswordValidator = celebrate({
    body: Joi.object().keys({
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    })
})

const addProductValidator = celebrate({
    body: Joi.object().keys({
        productName: Joi.string().required(),
        price: Joi.string().required(),
        image: Joi.string().optional(),
    })
})

module.exports = { signupReqValidator, signinReqValidator, resetPasswordValidator, addProductValidator }