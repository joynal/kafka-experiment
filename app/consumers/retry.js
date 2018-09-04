require('dotenv').config();
const kafka = require('kafka-node');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

const { gracefulShutdown, sleep } = require('../utils');
const addSubscriberToCampaign = require('../providerIntegration');

const { ConsumerGroup } = kafka;

const options = {
  kafkaHost: process.env.KAFKA_SERVER_URL,
  groupId: 'ProviderGroup',
};

const consumerGroup = new ConsumerGroup(options, process.env.RETRY_PRODUCER);

// Retry after 5 minute
consumerGroup.on('message', async (record) => {
  console.log(record);
  const message = JSON.parse(record.value);
  const diffTime = differenceInMilliseconds(Date.now(), message.timestamp);

  if (diffTime < process.env.RETRY_INTERVAL) await sleep(process.env.RETRY_INTERVAL - diffTime);

  addSubscriberToCampaign(message, process.env.FAILED_PRODUCER);
});

consumerGroup.on('error', (err) => {
  console.log(`${process.env.RETRY_PRODUCER}-consumer >> error`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
