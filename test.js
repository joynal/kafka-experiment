require('dotenv').config();
const faker = require('faker');

const producer = require('./app/producer');
const { sendToQueue } = require('./app/utils');

for (let i = 0; i <= 100; i += 1) {
  sendToQueue(producer, 'providers', [
    JSON.stringify({
      api_key: process.env.KLAVIYO_API_KEY,
      email: faker.internet.email(),
      properties: {
        $first_name: faker.name.firstName(),
        $last_name: faker.name.lastName(),
      },
      confirm_optin: false,
    }),
  ]);
}
