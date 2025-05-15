import { initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '../shared/transformer.js';
import { Context } from './context.js';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
const publicProcedure = t.procedure;

export const devvitProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.devvit) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      devvit: opts.ctx.devvit,
    },
  });
});
