const videoCompressController = require("../controllers/videoCompressController.js");
const fileUpload = require("express-fileupload");
const Router = require("express");


const videoCompressRoute = Router();
videoCompressRoute

  .get('/get-compressed-video', videoCompressController.getCompressedVideo)
  .post('/compress-video/:percentage', fileUpload({ tempFileDir: "temp", useTempFiles: true }), videoCompressController.compressVideo);

module.exports = videoCompressRoute;
