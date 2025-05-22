import { Devvit } from '@devvit/public-api';

// Side effect import to bundle the server. The /index is required for server splitting.
import '../server/index';
import { defineConfig } from '@devvit/server';

defineConfig({
  name: 'TRPC Example',
  entry: 'index.html',
  height: 'tall',
  menu: {
    enable: true,
    label: 'New TRPC Example Post',
    postTitle: 'TRPC Example',
  },
});

export default Devvit;
