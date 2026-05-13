import { createClient } from '@metagptx/web-sdk';
import { config } from './config';

// Create client instance
export const client = createClient({
  baseURL: config.API_BASE_URL,
});
