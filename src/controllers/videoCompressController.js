import { fork } from 'child_process';
import status from 'http-status';
import filesystem from 'fs';
import responseHelper from '../helpers/responseHelper.js';

const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = status;

class VideoCompressController {
  static async compressVideo(req, res) {
    try {
      const { video } = req.files;
      const { tempFilePath } = video;
      const crf = req.params.percentage === '20' ? "-crf 38" : req.params.percentage === '30' ? "-crf 32" : "-crf 24";

      if (!video && !tempFilePath) {
        responseHelper.handleError(BAD_REQUEST, 'Something wrong occured, please upload file and try again');
        return responseHelper.response(res);
      }

      const { name } = video;
      const child = fork("video.js");

      child.send({ tempFilePath, name, crf });

      child.on("message", (data) => {
        const { status, statusCode, statusMessage, percentage } = data;

        if (status === 'end') {
          const path = `./temp/${name}`;
          const stats = filesystem.statSync(path);

          const videoSize = stats.size;
          if (req.headers.range) {
            const { range } = req.headers;
            const parts = range.replace(/bytes=/, "").split("-");
            const partialstart = parts[0];
            const partialend = parts[1];

            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total - 1;
            const chunksize = (end - start) + 1;

            const file = filesystem.createReadStream(path, { start, end });
            res.writeHead(statusCode, { 'Content-Range': `bytes ${start}-${end}/${total}`, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
            file.pipe(res);
          }

          res.writeHead(statusCode, { 'Content-Length': videoSize, 'Content-Type': 'video/mp4' });
          filesystem.createReadStream(path).pipe(res);
        }

        io.emit('progressPercentages', percentage);
      });
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  }

  static async getCompressedVideo(req, res) {
    try {
      const path = `./temp/logic-explained--how-to-json.mp4`;
      const stats = filesystem.statSync(path);
      const videoSize = stats.size;

      if (req.headers.range) {
        const { range } = req.headers;
        const parts = range.replace(/bytes=/, "").split("-");
        const partialstart = parts[0];
        const partialend = parts[1];

        const start = parseInt(partialstart, 10);
        const end = partialend ? parseInt(partialend, 10) : total - 1;
        const chunksize = (end - start) + 1;

        const file = filesystem.createReadStream(path, { start, end });
        res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${total}`, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
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
