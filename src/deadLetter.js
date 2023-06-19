import { kafka } from './helpers/kafkaClient.js';
import { deadLetterQueue } from './config.js';

const consumer = kafka.consumer({ groupId: 'DeadLetterGroup' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: deadLetterQueue,
    fromBeginning: true
  });
  await consumer.run({
    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {
      console.log(`- ${topic}[${partition}] ${message.value}`);
    },
  });
};

run()
  .catch(e => console.error(`[deadLetter/consumer] ${e.message}`, e));
