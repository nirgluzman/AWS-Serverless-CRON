// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendemailcommand.html

const Responses = require('../common/API_Responses');

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const client = new SESClient();

exports.handler = async (event) => {
  console.log('event', event);

  const message = `Hey Nir,
  Good luck with the interviews`;

  const params = {
    Source: 'nir.gluzman@gmail.com',
    Destination: {
      ToAddresses: ['nir.gluzman@gmail.com'],
    },
    Message: {
      Subject: { Data: 'reminder email' },
      Body: {
        Text: { Data: message },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await client.send(command);
    return Responses._200({ message: 'Email sent' });
  } catch (err) {
    console.log('error with SES', err);
    return Responses._500({ message: 'failed to send the email' });
  }
};
