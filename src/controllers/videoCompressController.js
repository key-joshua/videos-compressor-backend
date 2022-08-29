import responseHelper from '../Helpers/responseHelper.js';
import { fork } from 'child_process';
import  status  from 'http-status';
import filesystem from 'fs';

const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = status

class VideoCompressController {
  static async compressVideo(req, res) {
    try {
      const video = req.files.video;
      const tempFilePath = video.tempFilePath;
      const crf = req.params.percentage === '20' ? "-crf 38" : req.params.percentage === '30' ? "-crf 32" : "-crf 24"
      
      if (!video && !tempFilePath) {
        responseHelper.handleError(BAD_REQUEST, 'Something wrong occured, please upload file and try again');
        return responseHelper.response(res);
      };

      const  name = video.name;
      const child = fork("video.js");

      child.send({ tempFilePath, name, crf });

      child.on("message", (data) => {
        const { status, statusCode, statusMessage, percentage } = data;

        if (status === 'end') {
          const path = `./temp/${name}`;
          var stats = filesystem.statSync(path);
  
          var videoSize = stats.size;
          if (req.headers.range) {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
        
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total-1;
            var chunksize = (end-start)+1;
        
            var file = filesystem.createReadStream(path, {start: start, end: end});
            res.writeHead(statusCode, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
            file.pipe(res);
        
          }
  
          res.writeHead(statusCode, { 'Content-Length': videoSize, 'Content-Type': 'video/mp4' });
          filesystem.createReadStream(path).pipe(res);
        }

        io.emit('progressPercentages', percentage)
      });
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  }

  
  static async getCompressedVideo(req, res) {
    try {
      const path = `./temp/logic-explained--how-to-json.mp4`;
      var stats = filesystem.statSync(path);
      var videoSize = stats.size;

      if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];
    
        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
    
        var file = filesystem.createReadStream(path, {start: start, end: end});
        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
        file.pipe(res);
    
      }

      res.writeHead(200, { 'Content-Length': videoSize, 'Content-Type': 'video/mp4' });
      filesystem.createReadStream(path).pipe(res);
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  }
}

export default VideoCompressController;