import { RequestContext } from '@devvit/server';
import * as trpcNext from '@trpc/server/adapters/next';

export async function createContext({ req }: trpcNext.CreateNextContextOptions) {
  return {
    devvit: RequestContext(req.headers),
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
