import { kafka } from './helpers/kafkaClient.js';
import sendToIntegration from './helpers/integration.js';
import { contactSubmissionQueue } from './config.js';

const consumer = kafka.consumer({ groupId: 'ContactSubmissionGroup' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: contactSubmissionQueue,
    fromBeginning: true
  });
  await consumer.run({
    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {
      console.log(`- ${topic}[${partition}] ${message.value}`);
      await sendToIntegration(message.value);
    },
  });
};

run()
  .catch(e => console.error(`[contactSubmission/consumer] ${e.message}`, e));

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
