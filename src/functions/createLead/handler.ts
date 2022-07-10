import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk'
import { v4 } from 'uuid';
import schema from './schema';

/*
* @@description createLead function add data to LeadTable and InterestTable depending upon requested data.
* @@returns response json object with status and message.
*/
const docClient = new aws.DynamoDB.DocumentClient();
const createLead: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const reqBody = event.body;
  try {
    if (reqBody.Id && reqBody.message) {
      return await addToInterestTable(reqBody);
    } else if (reqBody.email && reqBody.phone && reqBody.first_name) {
      const duplicateData = await docClient.scan({
        TableName: 'LeadTable',
        IndexName: 'Id-index',
        FilterExpression: 'phone = :phone OR email = :email',
        ExpressionAttributeValues: {
          ':phone': reqBody.phone,
          ':email': reqBody.email
        }
      }
      ).promise();
      if (duplicateData.Items.length > 0) {
        return formatJSONResponse({
          message: `data already exist.`,
          statusCode: 409
        })
      } else {
        return await addToLeadTable(reqBody);
      }
    } else {
      return formatJSONResponse({
        message: `Bad Request.`,
        statusCode: 400,
      });
    }
  } catch (err) {
    return formatJSONResponse({
      message: `error in inserting data ${err}`,
      statusCode: 500
    })
  }
}

/*
* @@description addToLeadTable function add data to LeadTable.
* @@returns response json object with status and message.
*/
const addToLeadTable = async (data) => {
  try {
    const Id = v4();
    const date = new Date().toISOString();
    const leadsData = {
      Id: Id,
      email: data.email,
      phone: data.phone,
      first_name: data.first_name,
      last_name: data.last_name,
      created_at: date,
      updated_at: date
    }
    const leadeInsertRes = await docClient.put({
      TableName: 'LeadTable',
      Item: leadsData
    }).promise();
    if (leadeInsertRes.$response.httpResponse.statusCode === 200) {
      return await addToInterestTable(data, Id);
    }
  } catch (err) {
    return formatJSONResponse({
      message: `Error in adding data to table`,
      statusCode: 500,
    });
  }
}

/*
* @@description addToLeadTable function add data to LeadTable with provided LeadId.
* @@returns response json object with status and message.
*/
const addToInterestTable = async (data, Id = null) => {
  try {
    const date = new Date().toISOString();
    const leadId = Id ? Id : data.Id;
    if (leadId) {
      const validId = await docClient.scan({
        TableName: 'LeadTable',
        FilterExpression: 'Id = :Id',
        ExpressionAttributeValues: {
          ':Id': leadId,
        }
      }).promise()
      if (validId.Items.length > 0) {
        const interestData = {
          Id: v4(),
          lead_id: leadId,
          message: data.message,
          created_at: date,
          updated_at: date
        }
        await docClient.put({
          TableName: 'InterestsTable',
          Item: interestData
        }).promise();
        return formatJSONResponse({
          message: `Data added successfully.`,
          statusCode: 200,
        });
      } else {
        return formatJSONResponse({
          message: `Invalid Lead Id`,
          statusCode: 400,
        });
      }
    }
  } catch (err) {
    return formatJSONResponse({
      message: `error in inserting data in Interest table ${err}`,
      statusCode: 500
    })
  }
}

export const main = middyfy(createLead);