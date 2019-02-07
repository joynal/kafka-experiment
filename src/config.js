require('dotenv').config();

module.exports = {
  kafkaServerUrl: process.env.KAFKA_SERVER_URL,
  noAckBatchSize: process.env.KAFKA_CLIENT_BATCH_SIZE,
  noAckBatchAge: process.env.KAFKA_CLIENT_BATCH_AGE,
  producerAcks: process.env.PRODUCER_ACKS,
  producerAttributes: process.env.PRODUCER_ATTRIBUTES,

  messageBatchSize: process.env.MESSAGE_BATCH_SIZE,

  providerTopic: process.env.PROVIDER_TOPIC,
  providerRetryTopic: process.env.PROVIDER_RETRY_TOPIC,
  providerFailedTopic: process.env.PROVIDER_FAILED_TOPIC,

  klaviyoURL: process.env.KLAVIYO_URL,
  klaviyoApiKey: process.env.KLAVIYO_API_KEY,

  retryInterval: process.env.RETRY_INTERVAL,
};
