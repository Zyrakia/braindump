import z from 'zod';

export const LinkStatusValues = ['failed', 'success', 'processing', 'pending'] as const;

export const LinkSchema = z.object({
	href: z.url('URL is required').trim().max(1024, 'Maximum 1024 characters'),
	title: z
		.string('Title is required')
		.trim()
		.min(1, 'Title is required')
		.max(255, 'Maximum 255 characters'),
	faviconUrl: z.url('Must be a URL').trim().max(255, 'Maximum 255 characters').optional(),
	imgUrl: z.url('Must be a URL').trim().max(255, 'Maximum 255 characters').optional(),
	embedding: z.array(z.number()).length(1024, 'Must include exactly 1024 values').optional(),
	content: z.string().optional(),
	contentHash: z.string().optional(),
	status: z.enum(LinkStatusValues).default('pending'),
	statusText: z.string().min(1, 'Minimum 1 character').max(255, 'Maximum 255 characters'),
	embeddedAt: z.number().nonnegative('Timestamp must be positive'),
	fetchedAt: z.number().nonnegative('Timestamp must be positive'),
});

export type Link = z.infer<typeof LinkSchema>;
export type LinkStatus = (typeof LinkStatusValues)[number];
