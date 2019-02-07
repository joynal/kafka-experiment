require('dotenv').config();
const kafka = require('kafka-node');

const { gracefulShutdown } = require('./helpers/utils');
const addSubscriberToCampaign = require('./helpers/providerIntegration');

const config = require('./config');

const { ConsumerGroup } = kafka;

const options = {
  kafkaHost: config.kafkaServerUrl,
  groupId: 'ProviderGroup',
};

const consumerGroup = new ConsumerGroup(options, config.providerTopic);

consumerGroup.on('message', (record) => {
  console.log(record);
  const message = JSON.parse(record.value);
  addSubscriberToCampaign(message, config.providerRetryTopic);
});

consumerGroup.on('error', (err) => {
  console.error(`${config.providerTopic}-consumer error ---------->`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
