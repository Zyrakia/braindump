import { defineConfig } from 'drizzle-kit';

import './lib/env-config';
import { env } from './lib/env';

export default defineConfig({
    out: './drizzle',
    schema: './lib/server/db/schema.ts',
    dialect: 'sqlite',
    casing: 'snake_case',
    dbCredentials: {
        url: env.DB_FILENAME,
    },
});
