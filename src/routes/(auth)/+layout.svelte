<script lang="ts">
	import { LanguageSwitcher } from '$lib/components/ui/language-switcher';
	import {
		locales as availableLocales,
		getLocale,
		isLocale,
		setLocale,
		type Locale
	} from '$lib/paraglide/runtime';

	let { children } = $props();
	const languageLabels: Partial<Record<Locale, string>> = {
		en: 'English',
		ar: 'العربية'
	};
	const languages = availableLocales.map((code) => ({
		code,
		label: languageLabels[code] ?? code.toUpperCase()
	}));
	let currentLang = $derived(getLocale());
</script>

<div class="grid h-full grid-rows-[auto_1fr]">
	<div
		class="sticky top-0 z-1 grid h-11 grid-cols-[1fr_auto_1fr] justify-center bg-background px-2 py-1 drop-shadow-sm/20"
	>
		<div></div>
		<div></div>
		<div class="flex gap-2 justify-self-end">
			<LanguageSwitcher
				{languages}
				bind:value={currentLang}
				onChange={(code: string) => {
					if (isLocale(code)) setLocale(code);
				}}
			/>
			<!-- <UserAvatar /> -->
		</div>
	</div>
	<main class="max-w-full overflow-auto">
		{@render children()}
	</main>
</div>
