<script lang="ts">
	import { resolve } from '$app/paths';
	import { forgotPassword } from '$lib/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Field, FieldDescription, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	const submissionError = $derived(
		forgotPassword.fields.allIssues()?.find((issue) => issue.path.length === 0)?.message
	);
</script>

<div class="flex flex-col items-center justify-start px-4">
	<div class="h-80 translate-y-12">
		<!-- <Logo /> -->
	</div>
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">{m.reset_password()}</Card.Title>
			<Card.Description>{m.reset_password_description()}</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...forgotPassword}>
				<FieldGroup>
					<Field>
						<FieldLabel for="email">{m.email_address()}</FieldLabel>
						<Input id="email" {...forgotPassword.fields.email.as('email')} />
						{#if forgotPassword.fields.email.issues()}
							<p class="text-sm text-destructive">
								{forgotPassword.fields.email.issues()![0].message}
							</p>
						{/if}
					</Field>
					{#if submissionError}
						<p class="mb-2 text-destructive">{submissionError}</p>
					{/if}
					{#if forgotPassword.result}
						<p class="mb-2 rounded-sm bg-green-300 p-3">
							{m.check_email_for_password_reset()}
						</p>
					{/if}
					<Field>
						<Button type="submit" class="w-full" disabled={forgotPassword.pending > 0}>
							{#if forgotPassword.pending > 0}
								<Loader2Icon class="animate-spin" />
							{/if}
							{m.send_instructions()}
						</Button>
						<FieldDescription class="text-center">
							{m.remembered_password()}
							<a href={resolve('/sign-in')}>{m.log_in()}</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
</div>
