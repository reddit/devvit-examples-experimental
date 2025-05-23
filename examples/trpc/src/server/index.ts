import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import { devvitProcedure, router } from './trpc';
import { createContext } from './context.js';

const appRouter = router({
  init: devvitProcedure.query(async ({ ctx }) => {
    return {
      postId: ctx.devvit.postId,
    };
  }),
  counter: {
    get: devvitProcedure.query(async ({ ctx }) => {
      const resp = await ctx.devvit.redis.get('counter');
      return resp ? parseInt(resp) : 0;
    }),
    increment: devvitProcedure
      .input(
        z.object({
          amount: z.number().positive().default(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const resp = await ctx.devvit.redis.incrBy('counter', input.amount);
        return resp;
      }),
    decrement: devvitProcedure
      .input(
        z.object({
          amount: z.number().negative().default(-1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const resp = await ctx.devvit.redis.incrBy('counter', input.amount);
        return resp;
      }),
  },
});

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  createContext,
  // You need the trailing slash here!
  basePath: '/api/',
});

server.listen(3000);
