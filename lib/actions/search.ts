'use server';

import z from 'zod';
import { SearchService } from '../server/services/search-service';
import { unwrapOrDomain } from '../utils/service';

export async function similaritySearch(dirtyQuery: string) {
    const { data: cleanQuery, error } = z
        .string('Query is required')
        .trim()
        .nonempty('Query is required')
        .min(0, 'Query is required')
        .max(4096, 'Maximum query length is 4096')
        .safeParse(dirtyQuery);

    if (error) {
        return { error: error.message };
    }

    const result = await SearchService.similaritySearchByContent(cleanQuery);
    return unwrapOrDomain(result, (error) => ({ error }));
}
