import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import { PipelineBase } from 'aws-cdk-lib/pipelines';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { SecretValue } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PipelineLearningStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new Pipeline(this, "Pipeline",{
      pipelineName: "Pipelinename",
      crossAccountKeys: false,
      restartExecutionOnUpdate: true
    });

    const cdkSourceOutput = new Artifact("CDKSourceOutput");
    const serviceSourceOutput = new Artifact("ServiceSourceOutput");

    pipeline.addStage({
      stageName: "Source",
      actions: [
        new GitHubSourceAction({
          owner: "rooneyviet",
          repo: "aws-pipeline-learning",
          branch: "master",
          actionName: "CDK_Source",
          oauthToken: SecretValue.secretsManager('github-pipeline2'),
          output: cdkSourceOutput
        }),
        new GitHubSourceAction({
          owner: "rooneyviet",
          repo: "testing-express-lambda",
          branch: "master",
          actionName: "Service_Source",
          oauthToken: SecretValue.secretsManager('github-pipeline2'),
          output: serviceSourceOutput
        })
      ]
    });

    const cdkBuildOutput = new Artifact("CdkBuildOuput");
    const serviceBuildOutput = new Artifact("ServiceBuildOuput");
    pipeline.addStage({
      stageName: "Build",
      actions:[
        new CodeBuildAction({
          actionName: "CDK_Build",
          input: cdkSourceOutput,
          outputs: [cdkBuildOutput],
          project: new PipelineProject(this, "CdkBuildProject",{
            environment: {
              buildImage: LinuxBuildImage.STANDARD_5_0
            },
            buildSpec: BuildSpec.fromSourceFilename('build-specs/cdk-build-specs.yml')
          })
        }),
        new CodeBuildAction({
          actionName: "Service_Build",
          input: serviceSourceOutput,
          outputs: [serviceBuildOutput],
          project: new PipelineProject(this, "ServiceBuildProject",{
            environment: {
              buildImage: LinuxBuildImage.STANDARD_5_0
            },
            buildSpec: BuildSpec.fromSourceFilename('build-specs/service-build-specs.yml')
          })
        })
      ]
    }
      
    )

  }
}
