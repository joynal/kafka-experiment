require('dotenv').config();
const kafka = require('kafka-node');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

const { gracefulShutdown, sleep } = require('../utils');
const addMemberToKlaviyo = require('./klaviyo');

const { ConsumerGroup } = kafka;

const options = {
  kafkaHost: process.env.KAFKA_SERVER_URL,
  groupId: 'ProviderGroup',
};

const consumerGroup = new ConsumerGroup(options, process.env.RETRY_PRODUCER_2);

// Retry after one hour
consumerGroup.on('message', async (record) => {
  const message = JSON.parse(record.value);
  const diffTime = differenceInMilliseconds(Date.now(), message.timestamp);

  if (diffTime < 60000) await sleep(60000 - diffTime);

  addMemberToKlaviyo(message, process.env.FAILED_PRODUCER);
});

consumerGroup.on('error', (err) => {
  console.log(`${process.env.RETRY_PRODUCER_2}-consumer >> error`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
