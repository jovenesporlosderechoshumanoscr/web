import { createAuthClient } from 'better-auth/react'
import { adminClient } from "better-auth/client/plugins"
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { ac, admin, editor, student } from './permission'

export const authClient = createAuthClient({
	plugins: [adminClient({
		ac,
		roles: { admin, editor, student },
	}), tanstackStartCookies()],
})
