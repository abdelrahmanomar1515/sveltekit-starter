import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

type Role = 'admin' | 'user';

export const checkRole =
	<I extends unknown[], O>(role: Role | Role[], fn: (...args: I) => O) =>
	(...args: I) => {
		const { locals } = getRequestEvent();
		if (!locals.user?.role) {
			error(401, 'Unauthorized');
		}
		if (!Array.isArray(role)) {
			role = [role];
		}
		if (!role.includes(locals.user.role as Role)) {
			error(401, 'Unauthorized');
		}
		return fn(...args);
	};
