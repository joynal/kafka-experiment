'use strict';

require('dotenv').config();
const kafka = require('kafka-node');

const Producer = kafka.Producer;
const Client = kafka.KafkaClient;
const client = new Client({kafkaHost: process.env.KAFKA_SERVER_URL});

const producer = new Producer(client, { requireAcks: process.env.PRODUCER_ACKS });

producer.on('error', function (err) {
  console.log('provider-producer >> error', err);
});

module.exports = producer;