require('dotenv').config();
const fetch = require('node-fetch');

const config = require('../src/config');

const test = async () => {
  try {
    const response = await fetch(config.klaviyoURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': config.klaviyoApiKey,
      },
      body: JSON.stringify({
        profiles: [{
          email: 'joynal@aaroza.com',
          properties: {
            $first_name: 'Joynal',
            $last_name: 'Abedin',
          },
          confirm_optin: false,
        }],
      }),
    });

    const json = await response.json();
    console.log('Klaviyo response ----------->', json);
    if (response.status !== 200) throw new Error(json.message);
  } catch (err) {
    console.error('Klaviyo sending error ----------->', err);
  }
};

test();
