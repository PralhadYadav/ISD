import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk'
import schema from './schema';

/*
* @@description getAllLeads function get all data from LeadTable and return response json.
* @@returns response json object with status, message and table data.
*/
const docClient = new aws.DynamoDB.DocumentClient();
const getAllLeads: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const res = await docClient.scan({
      TableName: 'LeadTable',
    }).promise()

    if (!res.Items) {
      return {
        statusCode: 400,
        body: JSON.stringify({ err: 'Data not found.' })
      }
    } else {
      res.Items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      return formatJSONResponse({
        message: `Leads fetch successfully.`,
        statusCode: 200,
        data: res.Items
      });
    }
  } catch (err) {
    return formatJSONResponse({
      message: `Error from getAllLeads`,
      err
    });
  }
};

export const main = middyfy(getAllLeads);
