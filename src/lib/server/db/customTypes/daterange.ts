import { customType } from 'drizzle-orm/pg-core';
import * as v from 'valibot';

export const DateRangeSchema = v.object({
	lower: v.date(),
	upper: v.date(),
	lowerInc: v.boolean(),
	upperInc: v.boolean()
});

export type DateRange = v.InferInput<typeof DateRangeSchema>;

export const dateRange = customType<{
	data: DateRange;
	driverData: string;
}>({
	dataType: () => 'daterange',
	toDriver: (data) => {
		const lowerStr = data.lower.toISOString().slice(0, 10);
		const upperStr = data.upper.toISOString().slice(0, 10);
		const lowerBracket = data.lowerInc ? '[' : '(';
		const upperBracket = data.upperInc ? ']' : ')';

		return `${lowerBracket}${lowerStr}, ${upperStr}${upperBracket}`;
	},
	fromDriver: (driverData) => {
		const indexOfComma = driverData.indexOf(',');
		const lower = new Date(driverData.slice(1, indexOfComma).trim());
		const upper = new Date(driverData.slice(indexOfComma + 1, -1).trim());
		const lowerInc = driverData[0] === '[';
		const upperInc = driverData[driverData.length - 1] === ']';

		return {
			lower,
			upper,
			lowerInc,
			upperInc
		};
	}
});
