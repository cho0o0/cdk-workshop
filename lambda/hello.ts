import { APIGatewayEvent, Handler } from 'aws-lambda';

export const handler : Handler = async (event: APIGatewayEvent) => {
  console.log('request:', JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${event.path}\n`
  };
}