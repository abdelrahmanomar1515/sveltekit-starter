<script lang="ts">
	import { resolve } from '$app/paths';
	import { signIn } from '$lib/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Field, FieldDescription, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { m } from '$lib/paraglide/messages';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';

	const submissionError = $derived(
		signIn.fields.allIssues()?.find((issue) => issue.path.length === 0)?.message
	);
</script>

<div class="flex flex-col items-center justify-start px-4">
	<div class="h-80 translate-y-12">
		<!-- <Logo /> -->
	</div>
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">{m.log_in_title()}</Card.Title>
			<Card.Description>{m.log_in_description()}</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...signIn}>
				<FieldGroup>
					<Field>
						<FieldLabel for="email">{m.email_address()}</FieldLabel>
						<Input id="email" {...signIn.fields.email.as('email')} />
						{#if signIn.fields.email.issues()}
							<p class="text-sm text-destructive">
								{signIn.fields.email.issues()![0].message}
							</p>
						{/if}
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password">{m.password()}</FieldLabel>
							<a href={resolve('/forgot-password')} class="ms-auto inline-block text-sm underline"
								>{m.forgot_password()}</a
							>
						</div>
						<Input id="password" {...signIn.fields.password.as('password')} />
						{#if signIn.fields.password.issues()}
							<p class="text-sm text-destructive">
								{signIn.fields.password.issues()![0].message}
							</p>
						{/if}
					</Field>
					{#if submissionError}
						<p class="mb-2 text-destructive">{submissionError}</p>
					{/if}
					<Field>
						<Button type="submit" class="w-full" disabled={signIn.pending > 0}>
							{#if signIn.pending > 0}
								<Loader2Icon class="animate-spin" />
							{/if}
							{m.log_in()}
						</Button>
						<FieldDescription class="text-center">
							{m.dont_have_account()}
							<a href={resolve('/sign-up')}>{m.create_account()}</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
</div>
