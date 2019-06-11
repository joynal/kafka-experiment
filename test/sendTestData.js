require('dotenv').config();
const faker = require('faker');

const producer = require('../src/helpers/producer');
const { sendToQueue } = require('../src/helpers/utils');

for (let i = 0; i < 50; i += 1) {
  sendToQueue(producer, 'provider', JSON.stringify({
    profiles: [{
      email: faker.internet.email(),
      properties: {
        $first_name: faker.name.firstName(),
        $last_name: faker.name.lastName(),
      },
      confirm_optin: false,
    }],
  }));
}
