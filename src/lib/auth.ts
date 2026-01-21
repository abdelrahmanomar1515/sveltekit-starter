import { getRequestEvent } from '$app/server';
import { DATABASE_URL } from '$env/static/private';
import { accessControl, admin, user } from '$lib/auth/permissions';
import { getDB, type DB } from '$lib/server/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
// import { Resend } from "resend";

export const getAuth = (env: { DATABASE_URL: string } | undefined, db: DB) => {
	if (!env) {
		throw new Error('Unable to create Auth, env is not defined.');
	}
	return betterAuth({
		emailVerification: {
			sendOnSignUp: false,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async (_data) => {
				// await mailer.sendMail({
				// 	from: 'no-reply@starter.com',
				// 	to: data.user.email,
				// 	subject: 'Please verify your email address',
				// 	text: `Hello ${data.user.name}. Please use this link to verify your email address: ${data.url}.`,
				// });
			}
		},
		emailAndPassword: {
			enabled: true,
			sendResetPassword: async ({ user, token }) => {
				// const appDomain = `https://starter.com`;
				// const resetUrl = `${appDomain}/reset-password?token=${token}`;
				// const resend = new Resend(env.RESEND_API_KEY);
				// const { error } = await resend.emails.send({
				// 	from: "no-reply@starter.com",
				// 	to: user.email,
				// 	subject: "Password reset instructions",
				// 	html: `<h3>Hello <b>${user.name}<b></h3><p>We received a password reset request for your account. If that wasn't you, then you can safely ignore this email.<br/>If it was you, then please use this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
				// });
				// if (error) {
				// 	console.error(error);
				// }
			}
		},
		database: drizzleAdapter(db, {
			provider: 'pg',
			usePlural: true
		}),
		plugins: [
			adminPlugin({
				ac: accessControl,
				roles: { user, admin }
			}),
			sveltekitCookies(getRequestEvent)
		]
	});
};

export const auth = getAuth({ DATABASE_URL: DATABASE_URL }, getDB({ DATABASE_URL: DATABASE_URL }));

export type Auth = ReturnType<typeof getAuth>;

export type Session = Auth['$Infer']['Session'];
