'use strict';

const fs = require('fs');
const path = require('path');

class Mp3Uploader {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = serverless.getProvider('aws');

    this.commands = {
      upload_mp3: {
        usage: 'Uploads mp3 file to S3 to be transcribed',
        lifecycleEvents: ['uploadFile'],
        options: {
          filename: {
            usage:
              'Specify the file from folder "mp3/" you want uploaded to s3',
            required: true,
            shortcut: 'f',
          },
        },
      },
    };

    this.hooks = {
      'upload_mp3:uploadFile': this.uploadFile.bind(this),
      'after:upload_mp3:uploadFile': this.afterUploadFile.bind(this),
    };
  }

  uploadFile() {
    const pathToFile = path.join('mp3', this.options['filename']);
    return new Promise(function (resolve, reject) {
      try {
        stats = fs.statSync(pathToFile);
        this.serverless.cli.log("File exists.");
        return this.provider.request('S3', 'upload', {
          Bucket: this.serverless.service.custom.mp3_uploader.bucket_name,
          Key: this.options['filename'],
          Body: fs.readFileSync(pathToFile)
        })
      }
      catch (e) {
        this.serverless.cli.log("File does not exist.");
        reject(e)
      }
    })
  }

  afterUploadFile() {
    this.serverless.cli.log('Get ready for transcription!');
  }
}

module.exports = Mp3Uploader;
