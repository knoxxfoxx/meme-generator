import { init } from '@instantdb/react';

const APP_ID = '01348a7a-0d39-42f6-bc28-344977ab3ad7';

// Initialize InstantDB
// Schema and permissions are managed in the InstantDB dashboard
export const db = init({ 
  appId: APP_ID,
  // Configure auth redirect URL for production
  ...(typeof window !== 'undefined' && {
    websocketURI: 'wss://api.instantdb.com/runtime/sync',
  }),
});
