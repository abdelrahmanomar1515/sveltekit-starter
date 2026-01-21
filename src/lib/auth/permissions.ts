import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

export const statement = {
	...defaultStatements
} as const;

export const accessControl = createAccessControl(statement);

export const admin = accessControl.newRole({
	...adminAc.statements
});

export const user = accessControl.newRole({
	user: []
});
