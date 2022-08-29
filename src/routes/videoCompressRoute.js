import videoCompressController from '../controllers/videoCompressController.js';
import fileUpload from 'express-fileupload';
import Router from 'express';

const videoCompressRoute = Router();
videoCompressRoute

.get('/get-compressed-video', videoCompressController.getCompressedVideo)
.post('/compress-video/:percentage', fileUpload({ tempFileDir: "temp", useTempFiles: true }), videoCompressController.compressVideo);

export default videoCompressRoute;