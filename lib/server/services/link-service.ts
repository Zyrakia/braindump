import { createService, DomainError } from '@/lib/utils/service';
import { db } from '../db/db';
import { Err, Ok } from 'ts-results-es';
import { DatabaseLink, LinksTable } from '../db/schema';
import { pickUrlComponents } from '@/lib/utils/url';
import { eq } from 'drizzle-orm';
import { LinkQueue } from '../db/link-queue';

export const LinkService = createService(db, {
	/**
	 * Creates a link from a URL and queues it into
	 * the processing pipeline.
	 *
	 * @param url the URL to be processed
	 * @return the created link entry, will be in the processing state
	 */
	create: async (client, url: string) => {
		const parts = pickUrlComponents(url, 'href', 'hostname');
		if (!parts) return Err(DomainError.of('Invalid URL'));

		const [inserted] = await client
			.insert(LinksTable)
			.values({
				href: parts.href,
				title: parts?.hostname,
			})
			.returning();

		LinkQueue.enqueue({ linkId: inserted.id });

		return Ok(inserted);
	},

	/**
	 * Deletes a link by it's ID.
	 *
	 * @param id the ID of the link
	 */
	delete: async (client, id: number) => {
		const res = await client.delete(LinksTable).where(eq(LinksTable.id, id));
		if (res.rowsAffected === 0)
			return Err(DomainError.of(`Unable to delete link by ID: ${id}`));

		return Ok(undefined);
	},

	/**
	 * Updates a link by it's ID.
	 *
	 * @param id the ID of the link
	 * @param partial the properties to update on the link
	 */
	update: async (
		client,
		id: number,
		partial: Partial<Omit<DatabaseLink, 'createdAt' | 'id'>>,
	) => {
		const res = await client.update(LinksTable).set(partial).where(eq(LinksTable.id, id));
		if (res.rowsAffected === 0)
			return Err(DomainError.of(`Unable to update link by ID: ${id}`));

		return Ok(undefined);
	},
});
