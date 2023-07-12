import { S3Event } from "aws-lambda/trigger/s3";

const runner = (event: S3Event) => {
  return {
    statusCode: 200,
    body: "HELLO WORLD.",
  };
};

export default runner;
