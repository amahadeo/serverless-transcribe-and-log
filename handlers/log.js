'use strict';

const uuidv1 = require('uuid/v1')
const awsSdk = require('aws-sdk');

const s3 = new awsSdk.S3();
const dynamodb = new awsSdk.DynamoDB.DocumentClient();

module.exports.log = (event, context, callback) => {
    const record = event.Records[0];

    const bucket_name = record.s3.bucket.name;
    const obj_key = record.s3.object.key;

    // Retrieve the object
    s3.getObject({
        Bucket: bucket_name,
        Key: obj_key
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
            return
        } else {
            const transcription = JSON.parse(data.Body.toString()).results.transcripts[0].transcript
            console.log("Raw transcription:\n", transcription);

            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Item: {
                    id: uuidv1(),
                    transcription: transcription,
                    createdAt: (new Date().getTime())
                },
            };

            // write the transcription to the database
            dynamodb.put(params, (err) => {
                // handle potential errors
                if (err) {
                    console.error(err, err.stack);
                    callback(err);
                    return;
                }

                callback(null, null);
            })
        }
    })
};
