const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'ap-south-1' });

const EMAIL_FROM = 'pooja.shetty+source@7edge.com';

module.exports.handler = async (event) => {
    try {
    const { to, name } = JSON.parse(event.body);

    const params = {
        Destination: { ToAddresses: [to] },
        Source: EMAIL_FROM,
        Template: "MyTemplate",
        TemplateData: JSON.stringify({ name }),
    };

  
    const result = await ses.sendTemplatedEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent", result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

