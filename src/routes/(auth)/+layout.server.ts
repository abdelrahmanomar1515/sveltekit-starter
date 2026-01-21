import { resolve } from '$app/paths';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	const e = getRequestEvent();
	const user = e.locals.user;
	if (!user) {
		return;
	}

	const redirectTo = e.url.searchParams.get('redirectTo') || '/';
	if (redirectTo.startsWith('/')) {
		redirect(303, redirectTo);
	}
	redirect(303, resolve('/'));
};
