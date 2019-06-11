const fetch = require('node-fetch');

const producer = require('./producer');
const { sendToQueue } = require('./utils');

const config = require('../config');

module.exports = async (message, nextTopic = null) => {
  try {
    const response = await fetch(config.klaviyoURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': config.klaviyoApiKey,
      },
      body: message,
    });

    const json = await response.json();
    console.log('Klaviyo response ----------->', json);
    if (response.status !== 200) throw new Error(json.message);
  } catch (err) {
    console.error('Klaviyo sending error ----------->', err);

    if (nextTopic) {
      console.log(`Sending message to ${nextTopic}`);
      const messageCopy = JSON.parse(message);
      messageCopy.timestamp = Date.now();
      messageCopy.failingReason = err.message;
      sendToQueue(producer, nextTopic, JSON.stringify(messageCopy));
    }
  }
};
