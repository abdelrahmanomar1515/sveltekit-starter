<script lang="ts">
	import { resolve } from '$app/paths';
	import { resetPassword, signIn } from '$lib/auth.remote';
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
			<Card.Title class="text-2xl">{m.change_password()}</Card.Title>
			<Card.Description>{m.change_password_description()}</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...resetPassword}>
				<FieldGroup>
					<Field>
						<FieldLabel for="password">{m.new_password()}</FieldLabel>
						<Input id="password" {...resetPassword.fields.newPassword.as('password')} />
						{#if resetPassword.fields.newPassword.issues()}
							<p class="text-sm text-destructive">
								{resetPassword.fields.newPassword.issues()![0].message}
							</p>
						{/if}
					</Field>
					<Field>
						<FieldLabel for="confirm-password">{m.confirm_new_password()}</FieldLabel>
						<Input id="confirm-password" {...resetPassword.fields.confirmPassword.as('password')} />
						<FieldDescription>{m.confirm_password_description()}</FieldDescription>
						{#if resetPassword.fields.confirmPassword.issues()}
							<p class="text-sm text-destructive">
								{resetPassword.fields.confirmPassword.issues()![0].message}
							</p>
						{/if}
					</Field>
					{#if submissionError}
						<p class="mb-2 text-destructive">{submissionError}</p>
					{/if}
					{#if resetPassword.result}
						<p class="mb-2 rounded-sm bg-green-300 p-3">
							{m.password_change_success()}
							<a href={resolve('/sign-in')} class="underline">{m.log_in()}</a>
							{m.to_proceed()}
						</p>
					{/if}
					<Field>
						<Button type="submit" class="w-full" disabled={resetPassword.pending > 0}>
							{#if resetPassword.pending > 0}
								<Loader2Icon class="animate-spin" />
							{/if}
							{m.change_password()}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
</div>
