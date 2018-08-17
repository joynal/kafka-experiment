require('dotenv').config();
const kafka = require('kafka-node');

const { ConsumerGroup } = kafka;
const { gracefulShutdown } = require('../utils');

const options = {
  kafkaHost: process.env.KAFKA_SERVER_URL,
  groupId: 'ProviderGroup',
};

const consumerGroup = new ConsumerGroup(options, process.env.FAILED_PRODUCER);

consumerGroup.on('message', (message) => {
  console.log(message);
});

consumerGroup.on('error', (err) => {
  console.log(`${process.env.FAILED_PRODUCER}-consumer >> error`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
