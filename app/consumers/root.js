require('dotenv').config();
const kafka = require('kafka-node');

const { gracefulShutdown } = require('../utils');
const addMemberToKlaviyo = require('./klaviyo');

const { ConsumerGroup } = kafka;

const options = {
  kafkaHost: process.env.KAFKA_SERVER_URL,
  groupId: 'ProviderGroup',
};

const consumerGroup = new ConsumerGroup(options, process.env.ROOT_PRODUCER);

consumerGroup.on('message', (record) => {
  console.log(record);
  const message = JSON.parse(record.value);
  addMemberToKlaviyo(message, process.env.RETRY_PRODUCER_1);
});

consumerGroup.on('error', (err) => {
  console.log(`${process.env.ROOT_PRODUCER}-consumer >> error`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
