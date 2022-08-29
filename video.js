import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import status from '"http-status';
ffmpeg.setFfmpegPath(ffmpegPath);
import filesystem from 'fs';


const { INTERNAL_SERVER_ERROR } = status

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
    .videoCodec('libx265')
    .addOptions([crf])
    .on("end", () => {
      endProcess({ statusCode: OK, statusMessage: "Video compressed successfully" });
    })
    .on("error", (err) => {
      endProcess({ statusCode: INTERNAL_SERVER_ERROR, statusMessage: err.message });
    })
    .on('codecData', data => {
       totalTime = parseInt(data.duration.replace(/:/g, '')) 
    })
    .on('progress',(progress) => {
      const percentage = ((parseInt(progress.timemark.replace(/:/g, ''))) / totalTime) * 100;
      process.send({ status: 'progress', statusCode: 200, statusMessage: 'progress', percentage });
    })
    .save(`./temp/${name}`);
});