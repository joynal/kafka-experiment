require('dotenv').config();
const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const Client = kafka.KafkaClient;

const client = new Client({
  kafkaHost: process.env.KAFKA_SERVER_URL,
  noAckBatchOptions: {
    noAckBatchSize: process.env.KAFKA_CLIENT_BATCH_SIZE,
    noAckBatchAge: process.env.KAFKA_CLIENT_BATCH_AGE,
  },
});

const producer = new HighLevelProducer(client, {
  requireAcks: process.env.PRODUCER_ACKS,
});

producer.on('error', (err) => {
  console.log('producer error >>>', err);
});

module.exports = producer;
