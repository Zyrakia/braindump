import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env';

export default defineConfig({
	out: './drizzle',
	schema: './lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: env.DB_FILENAME,
	},
});
