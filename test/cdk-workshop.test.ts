import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import CdkWorkshop = require('../lib/cdk-workshop-stack');

test('Lambda Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(
    haveResource('AWS::Lambda::Function', {
      "Handler": "hello.handler",
      "Runtime": "nodejs10.x"
    }),
  );
  expectCDK(stack).to(
    haveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      }
    }),
  );
});

test('Api Gateway Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(
    haveResource('AWS::ApiGateway::RestApi', {
      "Name": "Endpoint"
    }),
  );
});

