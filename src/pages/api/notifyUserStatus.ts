import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

// Configure AWS SDK
const lambda = new AWS.Lambda({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, status } = req.body;

    if (!email || !status) {
      return res.status(400).json({ error: 'Missing required fields: email, status' });
    }

    // Validate status
    if (!['Suspended', 'Active'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "Suspended" or "Active"' });
    }

    // Invoke the Lambda function
    const params = {
      FunctionName: process.env.NOTIFY_USER_STATUS_LAMBDA_FUNCTION_NAME || 'notifyUserStatusChange',
      InvocationType: 'Event', // Async invocation
      Payload: JSON.stringify({
        email,
        firstName: firstName || 'User',
        status
      })
    };

    const result = await lambda.invoke(params).promise();

    console.log('Lambda invocation result:', result);

    return res.status(200).json({ 
      message: 'Email notification triggered successfully',
      requestId: result.$response.requestId 
    });

  } catch (error) {
    console.error('Error invoking Lambda function:', error);
    return res.status(500).json({ 
      error: 'Failed to trigger email notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
