'use strict';

require('dotenv').config();
const producer = require('./producers/root');
const { sendToQueue } = require('./utils');

sendToQueue(producer, 'providers', [
  JSON.stringify({
    api_key: process.env.KLAVIYO_API_KEY,
    email: 'micckani@gmail.com',
    properties: {
      $first_name: 'Micckani',
      $last_name: 'Waldon'
    },
    confirm_optin: false
  })
]);

