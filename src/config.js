import { config } from 'dotenv';

config();

export const brokerUrl = process.env.KAFKA_SERVER_URL;
export const contactSubmissionQueue = process.env.CONTACT_SUBMISSION_QUEUE;
export const deadLetterQueue = process.env.DEAD_LETTER_QUEUE;
export const klaviyoURL = process.env.KLAVIYO_URL;
export const klaviyoApiKey = process.env.KLAVIYO_API_KEY;
