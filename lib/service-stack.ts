import {  Stack, StackProps } from "aws-cdk-lib";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import {HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Lambda } from "aws-cdk-lib/aws-ses-actions";

export class ServiceStack extends Stack {
    public readonly serviceCOde: Code
    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
    

    this.serviceCOde = Code.fromCfnParameters();

    
    const lambda = new Function(this, 'ServiceLambda', {
        runtime: Runtime.NODEJS_14_X,
        handler: 'src/lambda.handler',
        code: this.serviceCOde,
        functionName: "ServiceLambda"
    });


    const booksIntegration = new HttpLambdaIntegration('BooksIntegration', lambda);
    new HttpApi(this, "ServiceAPI", {
        defaultIntegration: booksIntegration
    
    },

    );

}


}