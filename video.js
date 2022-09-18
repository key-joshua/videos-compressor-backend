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
      if(percentages >= 1 && percentages <= 1.1) {
        console.log('Percentages:', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 5 && percentages <= 5.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 9 && percentages <= 9.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 14 && percentages <= 14.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 18 && percentages <= 18.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 23 && percentages <= 23.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 27 && percentages <= 27.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 29 && percentages <= 20.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 34 && percentages <= 34.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 38 && percentages <= 38.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 43 && percentages <= 43.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 47 && percentages <= 47.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 52 && percentages <= 52.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 56 && percentages <= 56.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 58 && percentages <= 58.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 63 && percentages <= 63.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 67 && percentages <= 67.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 69 && percentages <= 69.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 74 && percentages <= 74.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 78 && percentages <= 78.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 83 && percentages <= 83.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 87 && percentages <= 87.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 92 && percentages <= 92.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 96 && percentages <= 96.1) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
      if(percentages >= 99.9 && percentages <= 100) {
        console.log('Percentages', percentages);
        process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentages });
      }
    })
    .on("end", () => {
      endProcess({ statusCode: 200, statusMessage: "Video compressed successfully" });
    })
    .save(`./temp/${name}`);
});
