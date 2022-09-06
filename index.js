const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const responseHelper = require("./responseHelper.js");
const { fork } = require("child_process");
const filesystem = require("fs");

const fileUpload = require("express-fileupload");
const connectClientIO = require("socket.io");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const io = connectClientIO();
global.io = io;
app.io = io;

app.post('/api/video/compress-video/:percentage', fileUpload({ tempFileDir: "temp", useTempFiles: true }), (req, res) => {
  try {
    const { video } = req.files;
      const { tempFilePath } = video;
      const crf = req.params.percentage === '20' ? "-crf 36" : req.params.percentage === '30' ? "-crf 32" : "-crf 28";

      if (!video && !tempFilePath) {
        responseHelper.handleError(BAD_REQUEST, 'Something wrong occured, please upload file and try again');
        return responseHelper.response(res);
      }

      const child = fork("video.js");
      const { name, mimetype } = video;
      child.send({ tempFilePath, name, crf });

      child.on("message", (data) => {
        const { status, statusCode, statusMessage, percentages } = data;

        if (status === 'end') {
        const dataResponse = { fileName: name, fileType: mimetype }
        responseHelper.handleSuccess(statusCode, statusMessage, dataResponse);
        return responseHelper.response(res);
        }

        io.emit('progressPercentages', percentages);
      });
    } catch (error) {
      responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
      return responseHelper.response(res);
    }
  });

app.get('/api/video/get-compressed-video/:fileName/:fileType/:mimeType', async(req, res) => {
  try {
    const fileType = `${req.params.fileType}/${req.params.mimeType}`;
    const path = `${__dirname}/temp/${req.params.fileName}`;
    const fileBuffer = filesystem.readFileSync(path);
    const stat = filesystem.statSync(path);
    const fileSize = stat.size;

    const header = { 'Content-Length': fileSize, 'Content-Type': fileType };
    res.writeHead(200, header);
    res.end(fileBuffer);
  } catch (error) {
    responseHelper.handleError(INTERNAL_SERVER_ERROR, error.toString());
    return responseHelper.response(res);
  }
});

app.get('**', (req, res) => res.status(200).json({ status: 200, data: 'Welcome to Video Heritage Feed Backend' }));

export { io };
module.exports = app;