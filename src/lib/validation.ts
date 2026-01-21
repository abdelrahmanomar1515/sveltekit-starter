import * as v from 'valibot';

export const IdAsString = (message: string) =>
	v.pipe(v.string(), v.nonEmpty(message), v.regex(/^\d+$/), v.transform(Number), v.integer());
