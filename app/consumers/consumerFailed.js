'use strict';

require('dotenv').config();
const kafka = require('kafka-node');

const { offsetOutOfRangeCb } = require('../utils');

const Consumer = kafka.Consumer;
const Client = kafka.KafkaClient;
const client = new Client(process.env.KAFKA_SERVER_URL);

const topics = [{topic: 'providers-failed', partition: 0}];
const options = { autoCommit: false };
const consumer = new Consumer(client, topics, options);

consumer.on('error', function (err) {
  console.log('provider-failed-consumer >> error', err);
});

consumer.on('offsetOutOfRange', offsetOutOfRangeCb(client));

consumer.on('message', function (message) {
  console.log(message);
});
