import { Kafka, logLevel } from 'kafkajs';

import { brokerUrl } from '../config.js';

export const kafka = new Kafka({
  logLevel: logLevel.NOTHING,
  brokers: [brokerUrl],
  clientId: 'kafka-experiment',
});
