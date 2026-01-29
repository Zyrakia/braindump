import { env } from '@/lib/env';
import { buildDBClient, SqliteQueue } from 'liteque';
import z from 'zod';

const client = buildDBClient(env.QUEUE_FILENAME, { runMigrations: true });

const schema = z.object({ linkId: z.number() });
export type LinkQueueSchema = z.infer<typeof schema>;

export const LinkQueue = new SqliteQueue<LinkQueueSchema>('link-queue', client, {
	defaultJobArgs: { numRetries: 2 },
	keepFailedJobs: false,
});
