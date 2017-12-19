'use strict';

require('dotenv').config();
const kafka = require('kafka-node');

const { offsetOutOfRangeCb } = require('../utils');
const addMemberToKlaviyo = require('./klaviyo');

const Consumer = kafka.Consumer;
const Client = kafka.KafkaClient;
const client = new Client(process.env.KAFKA_SERVER_URL);

const topics = [{topic: process.env.ROOT_PRODUCER, partition: 0}];
const consumer = new Consumer(client, topics);

consumer.on('error', function (err) {
  console.log(`${process.env.ROOT_PRODUCER}-consumer >> error`, err);
});

consumer.on('offsetOutOfRange', offsetOutOfRangeCb(client));

consumer.on('message', function (record) {
  console.log(record);
  let message = JSON.parse(record.value);
  addMemberToKlaviyo(process.env.KLAVIYO_URL, process.env.RETRY_PRODUCER_1, message);
});
