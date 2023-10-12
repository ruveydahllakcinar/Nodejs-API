const router = require("express").Router()
const multer = require("multer")
const upload = require("../middlewares/lib/upload")
const APIError = require("../utils/errors")
const Response = require("../utils/response")

const auth = require("./auth.routes")

router.use(auth)

router.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError)
      throw new APIError("An error caused by multer occurred while loading the image:", err)
    else if (err)
      throw new APIError("There was an error loading the image:", err)
    else return new Response(req.savedImages, "Upload successful").success(res)



  })
})

module.exports = router