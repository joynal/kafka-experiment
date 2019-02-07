const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const Client = kafka.KafkaClient;

const config = require('../config');

const client = new Client({
  kafkaHost: config.kafkaServerUrl,
  noAckBatchOptions: {
    noAckBatchSize: config.noAckBatchSize,
    noAckBatchAge: config.noAckBatchAge,
  },
});

const producer = new HighLevelProducer(client, {
  requireAcks: config.producerAcks,
});

producer.on('error', (err) => {
  console.error('producer error ---------->', err);
});

module.exports = producer;
