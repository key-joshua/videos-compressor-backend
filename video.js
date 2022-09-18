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
    .addOptions(['-c:v libx265', '-b:v 600k', `${crf}`, '-preset ultrafast', '-c:a copy'])
    .on("error", (err) => {
      endProcess({ status: 'error', statusCode: 500, statusMessage: err.message, percentage: 0 });
    })
    .on('codecData', (data) => {
      totalTime = parseInt(data.duration.replace(/:/g, ''));
    })
    .on('progress', (progress) => {
      const percentages = ((parseInt(progress.timemark.replace(/:/g, ''))) / totalTime) * 100;

      console.log(percentages);
      if(percentages >= 5 && percentages <= 5.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 5 && percentages <= 5.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 15 && percentages <= 15.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 25 && percentages <= 25.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 35 && percentages <= 35.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 45 && percentages <= 45.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 55 && percentages <= 55.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 65 && percentages <= 65.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 75 && percentages <= 75.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 85 && percentages <= 85.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 95 && percentages <= 95.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 100 && percentages <= 100.1) {
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
     
    })
    .on("end", () => {
      endProcess({ statusCode: 200, statusMessage: "Video compressed successfully" });
    })
    .save(`./temp/${name}`);
});
