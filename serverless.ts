import type { AWS } from '@serverless/typescript';
import createLead from '@functions/createLead';
import getAllLeads from '@functions/getAllLeads'

/*
* @@description serverlessConfiguration has all the required aws lambda config.
*/
const serverlessConfiguration: AWS = {
  service: 'SalesDept',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
        ],
        Resource: [
          { "Fn::GetAtt": ['LeadsTable', 'Arn'] },
          { "Fn::GetAtt": ['InterestTable', 'Arn'] }
        ]
      }
    ]
  },
  // import the function via paths
  functions: { createLead, getAllLeads },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      LeadsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'LeadTable',
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
          AttributeDefinitions: [{
            AttributeName: 'Id',
            AttributeType: 'S'
          }, {
            AttributeName: 'created_at',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'Id',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'created_at',
            KeyType: 'RANGE'
          }]
        }
      },
      InterestTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'InterestsTable',
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
          AttributeDefinitions: [{
            AttributeName: 'Id',
            AttributeType: 'S'
          },
          {
            AttributeName: 'created_at',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'Id',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'created_at',
            KeyType: 'RANGE'
          }]
        }
      }
    }
  },
};

module.exports = serverlessConfiguration;
