import { createEnv } from '@t3-oss/env-nextjs';
import z from 'zod';

export const env = createEnv({
	server: {
		DB_FILENAME: z.string().transform((v) => (v.startsWith('file:') ? v : `file:${v}`)),
		QUEUE_FILENAME: z.string(),
	},
	client: {},
	experimental__runtimeEnv: process.env,
});
