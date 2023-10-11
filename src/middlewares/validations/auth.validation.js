const joi = require('joi')
const APIError = require('../../utils/errors')

class authValidation {
    constructor() { }
    static register = async (req, res, next) => {
        try {
            await joi.object({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Name field must be text",
                    "string.empty": "Name field must not be empty!",
                    "string.min": "Name field must be at least 3 characters",
                    "string.max": "Name field must be at most 100 characters",
                    "string.required": "Name field must be required!"
                }),
                lastname: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Lastname field must be text",
                    "string.empty": "Lastname field must not be empty!",
                    "string.min": "Lastname field must be at least 3 characters",
                    "string.max": "Lastname field must be at most 100 characters",
                    "string.required": "Lastname field must be required!"
                }),
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "Email field must be text",
                    "string.empty": "Email field must not be empty!",
                    "string.min": "Email field must be at least 3 characters",
                    "string.max": "Email field must be at most 100 characters",
                    "string.required": "Email field must be required!",
                    "string.email": "Please enter a valid email"
                }),
                password: joi.string().trim().min(3).max(36).required().messages({
                    "string.base": "Password field must be text",
                    "string.empty": "Password field must not be empty!",
                    "string.min": "Password field must be at least 6 characters",
                    "string.max": "Password field must be at most 36 characters",
                    "string.required": "Password field must be required!"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if (error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Please follow the Validation Rules", 400)
        }
        next()
    }


    static login = async (req, res, next) => {
        try {
            await joi.object({
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "Email field must be text",
                    "string.empty": "Email field must not be empty!",
                    "string.min": "Email field must be at least 3 characters",
                    "string.max": "Email field must be at most 100 characters",
                    "string.required": "Email field must be required!",
                    "string.email": "Please enter a valid email"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Password field must be text",
                    "string.empty": "Password field must not be empty!",
                    "string.min": "Password field must be at least 6 characters",
                    "string.max": "Password field must be at most 36 characters",
                    "string.required": "Password field must be required!"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if (error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Please follow the Validation Rules", 400)
        }

        next();
    }
}

module.exports = authValidation