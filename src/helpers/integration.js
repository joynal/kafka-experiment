import fetch from 'node-fetch';
import producer from './producer.js';
import { deadLetterQueue, klaviyoApiKey, klaviyoURL } from '../config.js';

export default async (message) => {
  try {
    const response = await fetch(klaviyoURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': klaviyoApiKey,
      },
      body: message,
    });

    const json = await response.json();
    console.log('Klaviyo response ----------->', json);
    if (response.status !== 200) throw new Error(json.message);
  } catch (err) {
    console.log(`Sending message to ${deadLetterQueue}`);
    await producer.connect();
    await producer.send({
      topic: deadLetterQueue,
      messages: [{
        value: JSON.stringify({
          ...JSON.parse(message.toString()),
          failingReason: err.message
        })
      }]
    });
    await producer.disconnect();
  }
};
