import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const runner: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  return {
    statusCode: 200,
    body: "HELLO WORLD.",
  };
};

export default runner;
