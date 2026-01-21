import { resolve } from '$app/paths';
import { form, getRequestEvent, query } from '$app/server';
import { m } from '$lib/paraglide/messages';
import { error, invalid, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth';
import * as v from 'valibot';

export const signIn = form(
	v.object({
		email: v.pipe(v.string(), v.nonEmpty(m.email_required()), v.email(m.valid_email())),
		password: v.pipe(v.string(), v.nonEmpty(m.password_required()))
	}),
	async ({ email, password }) => {
		try {
			const { auth } = getRequestEvent().locals;
			await auth.api.signInEmail({ body: { email, password } });
		} catch (e) {
			console.error(e);
			if (e instanceof APIError) {
				invalid(e.message);
			}
			error(400, 'Unable to log in.');
		}

		const redirectTo = getRequestEvent().url.searchParams.get('redirectTo') || '/';
		if (redirectTo.startsWith('/')) {
			redirect(303, redirectTo);
		}

		redirect(303, resolve('/'));
	}
);

export const signUp = form(
	v.pipe(
		v.object({
			name: v.pipe(v.string(), v.trim(), v.nonEmpty(m.name_required())),
			email: v.pipe(v.string(), v.nonEmpty(m.email_required()), v.email(m.valid_email())),
			password: v.pipe(
				v.string(),
				v.nonEmpty(m.password_required()),
				v.minLength(8, m.password_min_length())
			),
			confirmPassword: v.string()
		}),
		v.forward(
			v.partialCheck(
				[['password'], ['confirmPassword']],
				(input) => input.password === input.confirmPassword,
				m.password_dont_match()
			),
			['confirmPassword']
		)
	),
	async ({ name, email, password }) => {
		try {
			const { auth } = getRequestEvent().locals;
			await auth.api.signUpEmail({
				body: { email, name, password }
			});
		} catch (e) {
			console.error(e);
			if (e instanceof APIError) {
				invalid(e.message);
			}
			error(400, 'Unable to create account.');
		}

		redirect(303, resolve('/'));
	}
);

export const signOut = form(v.object({}), async () => {
	try {
		const e = getRequestEvent();
		const { auth } = e.locals;
		await auth.api.signOut({ headers: e.request.headers });
	} catch (e) {
		console.error(e);
		if (e instanceof APIError) {
			error(e.statusCode, e.message);
		}
		error(400, 'Unable to sign out.');
	}

	redirect(303, resolve('/sign-in'));
});

export const forgotPassword = form(
	v.object({
		email: v.pipe(v.string(), v.nonEmpty(m.email_required()), v.email(m.valid_email()))
	}),
	async ({ email }) => {
		try {
			const { auth } = getRequestEvent().locals;
			await auth.api.requestPasswordReset({
				body: { email, redirectTo: '/sign-in' }
			});
			return 'ok';
		} catch (e) {
			console.error(e);
			if (e instanceof APIError) {
				error(e.statusCode, e.message);
			}
			error(400, 'Unable to request password reset.');
		}
	}
);

export const resetPassword = form(
	v.pipe(
		v.object({
			newPassword: v.pipe(
				v.string(),
				v.nonEmpty(m.password_required()),
				v.minLength(8, m.password_min_length())
			),
			confirmPassword: v.string()
		}),
		v.forward(
			v.partialCheck(
				[['newPassword'], ['confirmPassword']],
				(input) => input.newPassword === input.confirmPassword,
				m.password_dont_match()
			),
			['confirmPassword']
		)
	),
	async ({ newPassword }) => {
		const token = getRequestEvent().url.searchParams.get('token');
		if (!token) {
			redirect(303, resolve('/sign-in'));
		}
		try {
			const { auth } = getRequestEvent().locals;
			await auth.api.resetPassword({ body: { newPassword, token } });
			return 'ok';
		} catch (e) {
			console.error(e);
			if (e instanceof APIError) {
				error(e.statusCode, e.message);
			}
			error(400, 'Unable to request password reset.');
		}
	}
);

export const getSession = query(async () => {
	try {
		const user = getRequestEvent().locals.user;
		if (!user) {
			throw new Error('Unauthorized');
		}
		return user;
	} catch (e) {
		console.error(e);
		if (e instanceof APIError) {
			error(e.statusCode, e.message);
		}
		error(400, 'Unable to get session information.');
	}
});
