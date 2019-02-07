const kafka = require('kafka-node');

const { ConsumerGroup } = kafka;
const { gracefulShutdown } = require('./helpers/utils');

const config = require('./config');

const options = {
  kafkaHost: config.kafkaServerUrl,
  groupId: 'ProviderFailedGroup',
};

const consumerGroup = new ConsumerGroup(options, config.providerFailedTopic);

consumerGroup.on('message', (message) => {
  console.log(message);
});

consumerGroup.on('error', (err) => {
  console.error(`${config.providerFailedTopic}-consumer error ---------->`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
