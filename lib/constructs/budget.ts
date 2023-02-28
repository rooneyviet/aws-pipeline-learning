import { CfnBudget } from 'aws-cdk-lib/aws-budgets';
import { Construct } from 'constructs';


interface BudgetProps{
    budgetAmount: number,
    emailAddress: string
}

export class Budget extends Construct{

    constructor(scope: Construct, id: string, props: BudgetProps){
        super(scope, id);

        new CfnBudget(this, "PipelineBudget", {
            budget: {
                budgetLimit:{
                    amount: props.budgetAmount,
                    unit: "USD"
                },
                budgetName: "Monthly Budget",
                budgetType: "COST",
                timeUnit: "MONTHLY",

            },
            notificationsWithSubscribers: [
                {
                    notification: {
                        notificationType: "ACTUAL",
                        threshold: 100,
                        comparisonOperator: "GREATER_THAN",
                        thresholdType: "PERCENTAGE"
                    },
                    subscribers: [
                        {
                            address: props.emailAddress,
                            subscriptionType: "EMAIL"
                        }
                    ]
                }
            ]
        })
    }
}