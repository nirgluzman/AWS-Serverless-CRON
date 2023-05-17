// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendemailcommand.html

const Responses = require('../common/API_Responses');

const axios = require('axios');

const newsURL = 'https://newsapi.org';

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const client = new SESClient();

exports.handler = async (event) => {
  console.log('event', event);

  const techNews = await getNews();
  const emailHTML = createEmailHTML(techNews);

  const params = {
    Source: 'nir.gluzman@gmail.com',
    Destination: {
      ToAddresses: ['nir.gluzman@gmail.com'],
    },
    Message: {
      Subject: { Data: 'Morning News' },
      Body: {
        Html: { Data: emailHTML },
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

const createEmailHTML = (techNews) => {
  return `
    <html>
        <body>
            <h1>Top Tech News</h1>
            ${techNews.map((article) => {
              return `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}"><button>Read More</button></a>
                `;
            })}
        </body>
    </html>
    `;
};

const getNews = async () => {
  const options = {
    params: {
      q: 'technology',
      language: 'en',
    },
    headers: {
      'X-Api-Key': 'API Key',
    },
  };

  const { data: newsData } = await axios.get(
    `${newsURL}/v2/top-headlines`,
    options
  );

  if (!newsData) {
    throw Error('no data from api');
  }

  return newsData.articles.slice(0, 5);
};
