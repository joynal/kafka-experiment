const fetch = require('node-fetch');
const queryString = require('querystring');

const producer = require('../producers/root');
const { sendToQueue } = require('../utils');

module.exports = async (message, nextTopic = null) => {
  try {
    const response = await fetch(process.env.KLAVIYO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Accept": "application/json"
      },
      body: queryString.stringify({
        api_key: message.api_key,
        email: message.email,
        properties: JSON.stringify(message.properties),
        confirm_optin: message.confirm_optin
      }),
    });

    let json = await response.json();
    console.log("statusCode >>", response.status);
    console.log("Klaviyo response >>", json);
    if (response.status !== 200) throw new Error(json.message);
  } catch (err) {
    console.log(err.message);
    
    if (nextTopic) {
      console.log(`Sending message to ${nextTopic}`);
      message.timestamp = Date.now();
      message.failingReason = err.message;
      sendToQueue(producer, nextTopic, JSON.stringify(message));
    }
  }
};
