/**
 * This is the client-side code that uses the inferred types from the server
 */
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';

/**
 * We only import the `AppRouter` type from the server - this is not available at runtime
 */
import type { AppRouter } from '../server/index'; // to-do: move shared types to shared.
import { transformer } from '../shared/transformer';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      url: window.location.origin + '/api',
      transformer,
    }),
  ],
});
