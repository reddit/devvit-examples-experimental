import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { createContext } from './context.js';
import { createServer, context, getServerPort } from '@devvit/server';
import { redis } from '@devvit/redis';

const appRouter = router({
  init: publicProcedure.query(async () => {
    const { postId } = context;
    return {
      postId,
    };
  }),
  counter: {
    get: publicProcedure.query(async () => {
      const resp = await redis.get('counter');
      return resp ? parseInt(resp) : 0;
    }),
    increment: publicProcedure
      .input(
        z.object({
          amount: z.number().positive().default(1),
        })
      )
      .mutation(async ({ input }) => {
        const resp = await redis.incrBy('counter', input.amount);
        return resp;
      }),
    decrement: publicProcedure
      .input(
        z.object({
          amount: z.number().negative().default(-1),
        })
      )
      .mutation(async ({ input }) => {
        const resp = await redis.incrBy('counter', input.amount);
        return resp;
      }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
  router: appRouter,
  createContext,
  // You need the trailing slash here!
  basePath: '/api/',
});

createServer(handler).listen(getServerPort());
