<script lang="ts">
	import { resolve } from '$app/paths';
	import { signUp } from '$lib/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Field, FieldDescription, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	const submissionError = $derived(
		signUp.fields.allIssues()?.find((issue) => issue.path.length === 0)?.message
	);
</script>

<div class="flex flex-col items-center justify-start px-4">
	<div class="h-80 translate-y-12">
		<!-- <Logo /> -->
	</div>
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">{m.sign_up_title()}</Card.Title>
			<Card.Description>{m.sign_up_description()}</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...signUp}>
				<FieldGroup>
					<Field>
						<FieldLabel for="name">{m.full_name()}</FieldLabel>
						<Input id="name" {...signUp.fields.name.as('text')} />
						{#if signUp.fields.name.issues()}
							<p class="text-sm text-destructive">
								{signUp.fields.name.issues()![0].message}
							</p>
						{/if}
					</Field>
					<Field>
						<FieldLabel for="email">{m.email_address()}</FieldLabel>
						<Input id="email" {...signUp.fields.email.as('email')} />
						{#if signUp.fields.email.issues()}
							<p class="text-sm text-destructive">
								{signUp.fields.email.issues()![0].message}
							</p>
						{/if}
					</Field>
					<Field>
						<FieldLabel for="password">{m.password()}</FieldLabel>
						<Input id="password" {...signUp.fields.password.as('password')} />
						<FieldDescription>{m.password_description()}</FieldDescription>
						{#if signUp.fields.password.issues()}
							<p class="text-sm text-destructive">
								{signUp.fields.password.issues()![0].message}
							</p>
						{/if}
					</Field>
					<Field>
						<FieldLabel for="confirm-password">{m.confirm_password()}</FieldLabel>
						<Input id="confirm-password" {...signUp.fields.confirmPassword.as('password')} />
						<FieldDescription>{m.confirm_password_description()}</FieldDescription>
						{#if signUp.fields.confirmPassword.issues()}
							<p class="text-sm text-destructive">
								{signUp.fields.confirmPassword.issues()![0].message}
							</p>
						{/if}
					</Field>
					{#if submissionError}
						<p class="mb-2 text-destructive">{submissionError}</p>
					{/if}
					<Field>
						<Button type="submit" class="w-full" disabled={signUp.pending > 0}>
							{#if signUp.pending > 0}
								<Loader2Icon class="animate-spin" />
							{/if}
							{m.create_account()}
						</Button>
						<FieldDescription class="text-center">
							{m.already_have_account()}
							<a href={resolve('/sign-in')}>{m.log_in()}</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
</div>
