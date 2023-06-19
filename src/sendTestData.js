import { fakerEN as faker } from '@faker-js/faker';

import producer from './helpers/producer.js';
import { contactSubmissionQueue } from './config.js';

const run = async () => {
  await producer.connect();

  for (let i = 0; i < 50; i += 1) {
    const reply = await producer.send({
      topic: contactSubmissionQueue,
      messages: [{
        value: JSON.stringify({
          profiles: [{
            email: faker.internet.email(),
            properties: {
              $first_name: faker.person.firstName(),
              $last_name: faker.person.lastName(),
            },
            confirm_optin: false,
          }],
        }),
      }]
    });

    console.log(`send to >>> ${reply[0].topicName} - ${reply[0].partition}`);
  }

  await producer.disconnect();
};

run()
  .catch(e => console.error(e.message));
