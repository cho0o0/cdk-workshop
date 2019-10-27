import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Constructs are the basic building block of CDK apps.
    // They represent abstract “cloud components” which can be composed together into higher level abstractions via scopes.
    // defines an AWS Lambda resource
    const hello = new lambda.Function(
      this, // In almost all cases, you’ll be defining constructs within the scope of current construct
      'HelloHandler', // an identifier which must be unique within the scope it’s created
      {
        runtime: lambda.Runtime.NODEJS_10_X,
        code: lambda.Code.fromAsset('lambda'), // code loaded from the "lambda" directory
        handler: 'hello.handler', // file is "hello", function is "handler"
      },
    );

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table
    })
  }
}
