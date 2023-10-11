const user = require("../models/user.model")
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
 
const login = async (req, res) => {
    const {email, password} = req.body
    const userInfo = await user.findOne({email})
    if (!userInfo)
    throw new APIError("Email or password is incorrect!",401)

    const comparePassword = await bcrypt.compare(password, userInfo.password)
    console.log(comparePassword);

    if (!comparePassword)
        throw new APIError("Email or password is incorrect!", 401)
    createToken(userInfo,res)
}


const register = async (req, res) => {
    const { email } = req.body

    const userCheck = await user.findOne({email})

    if (userCheck) {
        throw new APIError("The Email You Entered is in Use!", 401)
    }

    req.body.password = await bcrypt.hash(req.body.password, 10)

    console.log("hash şifre : ",req.body.password);

    const userSave = new user(req.body)

    await userSave.save()
        .then((data) => {
            return new Response(data, "Record Added Successfully").created(res)
        })
        .catch((err) => {
            throw new APIError("Failed to Register User!", 400)
        })
}

const me = async (req, res) =>{
    return new Response(req.user).success(res)
}

module.exports = { login, register,me }