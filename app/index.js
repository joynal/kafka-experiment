'use strict';

require('dotenv').config();

const faker = require('faker');
const producer = require('./producers/root');
const { sendToQueue } = require('./utils');

for (let i=0; i <= 100; i++){
  sendToQueue(producer, 'providers', [
    JSON.stringify({
      api_key: process.env.KLAVIYO_API_KEY,
      email: faker.internet.email(),
      properties: {
        $first_name: faker.name.firstName(),
        $last_name: faker.name.lastName()
      },
      confirm_optin: false
    })
  ]);

}
