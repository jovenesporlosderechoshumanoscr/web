import { createAuth } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from "./schema";
import { defineRelations } from 'drizzle-orm';
import { env } from 'cloudflare:workers';

export const relations = defineRelations(schema, (r) => ({
	user: {
		sessions: r.many.session(),
		accounts: r.many.account(),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
	},
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
		}),
	},
}));



export const db = drizzle(env.test_jpdh, { relations });
