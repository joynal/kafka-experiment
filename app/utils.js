'use strict';

require('dotenv').config();
const kafka = require('kafka-node');
const Offset = kafka.Offset;

// JS sleep helper
const sleep = time => new Promise((resolve) => setTimeout(resolve, time));

// provider helper
const sendToQueue = (producer, topic, messages) => {
  producer.send(
    [
      {
        topic: topic,
        partition: 0,
        messages: messages,
        attributes: 2,
        timestamp: Date.now()
      }
    ], (err, result) => {
      if(err) console.log(err);
      if (result && result.providers) console.log("Sent msg number", result.providers[0]);
    })
};

/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
const offsetOutOfRangeCb = client => topic => {
  const offset = new Offset(client);
  topic.maxNum = 2;
  offset.fetch([topic], function (err, offsets) {
    if (err) {
      return console.error(err);
    }
    const min = Math.min(offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
};

module.exports = {
  sleep,
  sendToQueue,
  offsetOutOfRangeCb
};