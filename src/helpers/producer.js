import { kafka } from './kafkaClient.js'

export default kafka.producer({
  allowAutoTopicCreation: false,
  transactionTimeout: 30000
});
