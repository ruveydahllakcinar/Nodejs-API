require("dotenv").config();
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken, createTemporaryToken, decodedTemporaryToken } = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment");



const login = async (req, res) => {
  const { email, password } = req.body
  const userInfo = await user.findOne({ email })
  if (!userInfo)
    throw new APIError("Email or password is incorrect!", 401)

  const comparePassword = await bcrypt.compare(password, userInfo.password)
  console.log(comparePassword);

  if (!comparePassword)
    throw new APIError("Email or password is incorrect!", 401)
  createToken(userInfo, res)
}


const register = async (req, res) => {
  const { email } = req.body

  const userCheck = await user.findOne({ email })

  if (userCheck) {
    throw new APIError("The Email You Entered is in Use!", 401)
  }

  req.body.password = await bcrypt.hash(req.body.password, 10)

  console.log("hash şifre : ", req.body.password);

  const userSave = new user(req.body)

  await userSave.save()
    .then((data) => {
      return new Response(data, "Record Added Successfully").created(res)
    })
    .catch((err) => {
      throw new APIError("Failed to Register User!", 400)
    })
}

const me = async (req, res) => {
  return new Response(req.user).success(res)
}


const forgetPassword = async (req, res) => {

  const { email } = req.body
  const userInfo = await user.findOne({ email }).select("name lastname email")

  if (!userInfo) return new APIError('Invalid user', 400)

  console.log("userInfo:", userInfo);

  const resetCode = crypto.randomBytes(3).toString("hex")
  await sendEmail({

    from: process.env.USER_EMAIL,
    to: process.env.EMAIL_TO,
    subject: "Password reset",
    text: `Password reset code ${resetCode}`,

  })

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
      }
    }
  )

  return new Response(true, "Please check your email box").success(res)

}

const resetCodeCheck = async (req, res) => {

  const { email, code } = req.body

  const userInfo = await user.findOne({ email }).select("_id name lastname email reset")
  if (!userInfo) throw new APIError("Invalid Code!", 401)
  const dbTime = moment(userInfo.reset.time)
  const nowTime = moment(new Date())

  const timeDiff = dbTime.diff(nowTime, "minutes")
  console.log("Time difference: ", timeDiff);

  if (timeDiff <= 0 || userInfo.reset.code !== code)
    throw new APIError("Invalid Code!", 401)

  const temporyToken = await createTemporaryToken(userInfo._id, userInfo.email)

  return new Response({ temporyToken }, "You can reset your password").success(res)

}

const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;

  const decodedToken = await decodedTemporaryToken(temporaryToken);
  console.log("decodedToken : ", decodedToken);

  const hashPassword = await bcrypt.hash(password, 10);

  await user.findByIdAndUpdate(
    { _id: decodedToken._id },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(decodedToken, "Şifre Sıfırlama Başarılı").success(res)
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};