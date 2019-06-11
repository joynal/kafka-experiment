const kafka = require('kafka-node');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

const { gracefulShutdown, sleep } = require('./helpers/utils');
const addSubscriberToCampaign = require('./helpers/integration');

const config = require('./config');

const { ConsumerGroup } = kafka;

const options = {
  kafkaHost: config.kafkaServerUrl,
  groupId: 'ProviderRetryGroup',
};

const consumerGroup = new ConsumerGroup(options, config.providerRetryTopic);

// Retry after 5 minute
consumerGroup.on('message', async (record) => {
  console.log(record);
  const message = JSON.parse(record.value);
  const diffTime = differenceInMilliseconds(Date.now(), message.timestamp);

  if (diffTime < config.retryInterval) await sleep(config.retryInterval - diffTime);

  addSubscriberToCampaign(JSON.stringify(message), config.providerFailedTopic);
});

consumerGroup.on('error', (err) => {
  console.error(`${config.providerRetryTopic}-consumer error ---------->`, err);
});

process.on('SIGINT', gracefulShutdown(consumerGroup));
process.on('SIGTERM', gracefulShutdown(consumerGroup));
