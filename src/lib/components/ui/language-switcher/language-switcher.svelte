<script lang="ts">
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import type { LanguageSwitcherProps } from './types';
	import { m } from '$lib/paraglide/messages';

	let {
		languages = [],
		value = $bindable(''),
		align = 'end',
		variant = 'outline',
		onChange,
		class: className
	}: LanguageSwitcherProps = $props();

	// set default code if there isn't one selected
	if (value === '') {
		// svelte-ignore state_referenced_locally
		value = languages[0].code;
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(buttonVariants({ variant }), className)}
		aria-label="Change language"
	>
		<GlobeIcon class="size-4" />
		<span class="sr-only">Change language</span>
		<span class="hidden sm:block">
			{m.language()}
		</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content {align}>
		<DropdownMenu.RadioGroup bind:value onValueChange={onChange}>
			{#each languages as language (language.code)}
				<DropdownMenu.RadioItem value={language.code}>
					{language.label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
