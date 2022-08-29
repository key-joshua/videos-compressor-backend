import fileUpload from 'express-fileupload';
import Router from 'express';
import videoCompressController from '../controllers/videoCompressController.js';

const videoCompressRoute = Router();
videoCompressRoute

  .get('/get-compressed-video', videoCompressController.getCompressedVideo)
  .post('/compress-video/:percentage', fileUpload({ tempFileDir: "temp", useTempFiles: true }), videoCompressController.compressVideo);

export default videoCompressRoute;
