import { building } from '$app/environment';
import { resolve as resolveRoute } from '$app/paths';
import { getRequestEvent } from '$app/server';
import { DATABASE_URL } from '$env/static/private';
import { getAuth } from '$lib/auth';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getDB } from '$lib/server/db';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		let dir: 'rtl' | 'ltr' = 'ltr';
		if (locale === 'ar') {
			dir = 'rtl';
		}

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', dir)
		});
	});

const handleDB: Handle = ({ event, resolve }) => {
	event.locals.db = getDB({ DATABASE_URL: DATABASE_URL });
	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const auth = getAuth({ DATABASE_URL: DATABASE_URL }, event.locals.db);
	event.locals.auth = auth;

	let session;
	try {
		session = await auth.api.getSession({ headers: event.request.headers });
	} catch (e) {
		console.error(e);
	}
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		if (!event.route.id?.startsWith('/(auth)')) {
			redirect(303, getSignInUrl());
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

// const adminGuard: Handle = async ({ event, resolve }) => {
// 	if (event.route.id?.startsWith('/admin') && event.locals.user?.role !== 'admin') {
// 		redirect(303, getSignInUrl());
// 	}
// 	if (
// 		event.route.id?.startsWith('/sm') &&
// 		event.locals.user?.role !== 'storeManager' &&
// 		event.locals.user?.role !== 'salesPerson'
// 	) {
// 		redirect(303, getSignInUrl());
// 	}
//
// 	return resolve(event);
// };

export const handle: Handle = sequence(handleDB, handleAuth, handleParaglide);

function getSignInUrl() {
	const event = getRequestEvent();
	const redirectUrl = new URL(resolveRoute(`/sign-in`), event.url);
	redirectUrl.searchParams.set('redirectTo', `${event.url.pathname}${event.url.search}`);
	return redirectUrl;
}
