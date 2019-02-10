const kafka = require('kafka-node');

const { Offset } = kafka;
const config = require('../config');

// JS sleep helper
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

// provider helper
const sendToQueue = (prod, topic, messages) => {
  prod.send(
    [
      {
        topic,
        messages,
        attributes: config.attributes,
        timestamp: Date.now(),
      },
    ],
    (err, result) => {
      if (err) console.error('send to queue error -------->', err);
      if (result) console.log('sent message at -------->', result);
    },
  );
};


/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
const offsetOutOfRangeCb = (client, consumer) => (topic) => {
  const offset = new Offset(client);
  const topicUpdated = topic;
  topicUpdated.maxNum = 2;
  offset.fetch([topicUpdated], (err, offsets) => {
    if (err) {
      return console.error(err);
    }
    const min = Math.min(offsets[topicUpdated.topic][topicUpdated.partition]);
    return consumer.setOffset(topicUpdated.topic, topicUpdated.partition, min);
  });
};

const gracefulShutdown = consumer => () => {
  console.log('Shutdown started --------->');
  consumer.close((err) => {
    console.log('Kafka connection closed --------->');
    process.exit(err ? 1 : 0);
  });
};

module.exports = {
  sleep,
  sendToQueue,
  offsetOutOfRangeCb,
  gracefulShutdown,
};
