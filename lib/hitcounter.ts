import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');

export interface HitCounterProps {
    /** the function for which we want to count url hits **/
    downstream: lambda.IFunction;
}

export class HitCounter extends cdk.Construct {
    /** allows accessing the counter function */
    public readonly handler: lambda.Function;

    /** the hit counter table */
    public readonly table: dynamodb.Table;

    constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        // define a DynamoDB table with path as the partition key
        // (every DynamoDB table must have a single partition key)
        const table = new dynamodb.Table(this, 'Hits', {
            partitionKey: {
                name: 'path',
                type: dynamodb.AttributeType.STRING,
            },
        });
        this.table = table;

        this.handler = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            // define a Lambda function which is bound to lambda/hitcounter.handler.
            handler: 'hitcounter.handler',
            code: lambda.Code.fromAsset('lambda'),
            // wire the Lambda’s environment variables to the functionName and tableName of our resources.
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: table.tableName,
            },
        });

        // grant the lambda role read/write permissions to our table
        table.grantReadWriteData(this.handler);

        // grant the lambda role invoke permissions to the downstream function
        props.downstream.grantInvoke(this.handler);
    }
}
