const filesystem = require('fs');
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

let totalTime;
process.on("message", (payload) => {
  const { tempFilePath, name, crf } = payload;

  const endProcess = (endPayload) => {
    const { statusCode, statusMessage } = endPayload;

    filesystem.unlink(tempFilePath, (err) => {
      if (err) { console.log(err); }
    });

    process.send({ status: 'end', statusCode, statusMessage, percentage: 0 });
    process.exit();
  };

  ffmpeg(tempFilePath)
    .fps(30)
    .videoCodec('libx265')
    .addOptions([crf])
    .on("end", () => {
      endProcess({ statusCode: 200, statusMessage: "Video compressed successfully" });
    })
    .on("error", (err) => {
      endProcess({ status: 'error', statusCode: 500, statusMessage: err.message, percentage: 0 });
    })
    .on('codecData', (data) => {
      totalTime = parseInt(data.duration.replace(/:/g, ''));
    })
    .on('progress', (progress) => {
      const percentage = ((parseInt(progress.timemark.replace(/:/g, ''))) / totalTime) * 100;
      process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentage });
    })
    .save(`./temp/${name}`);
});
