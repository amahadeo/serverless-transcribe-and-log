# Serverless Transcribe and Log

This is a serverless app that uploads a mp3 file to a AWS S3 bucket. From there, a lamba is triggered to transcribe the audio into text using Amazon Transcribe. A second lamba picks up the transcription and logs the text into AWS DynamoDB with a timestamp.

## Use-cases

- I feel this can be particularly useful for contact centers with large amounts of call recordings. The ability to automatically transcribe these calls (w/ high accuracy) opens new venues for actionable insight (searchable text, sentiment analysis, etc.)

## Setup

- Install [serverless cli](https://serverless.com/framework/docs/getting-started/).
- Install [AWS cli](https://docs.aws.amazon.com/polly/latest/dg/setup-aws-cli.html).

## Deploy

In order to deploy the example, simply run:

```bash
serverless deploy
```

After a succesful deploy, run the plugin:

```bash
serverless upload_mp3 --filename first.mp3
```

to upload audio files in the project 'mp3' folder to the S3 audio bucket.

## Usage

Add any mp3 files you'd like in to the project 'mp3' folder and run

```bash
serverless upload_mp3 --filename filename-here.mp3
```

and watch the magic unfold! Audio files uploaded will be transcripted and logged into a DynamoDB table.

## Enhancements

- Creating a React or SPA to read the data from DynamoDB and create a way to upload mp3's from the browser
- User management
- Integrate transcription with Elastic Search to make text searchable
