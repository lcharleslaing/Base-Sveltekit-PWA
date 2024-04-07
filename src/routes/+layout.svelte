<script>
	import { onMount } from 'svelte';

	onMount(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker
					.register('/sw.js')
					.then((registration) => {
						console.log('SW registered: ', registration);
					})
					.catch((registrationError) => {
						console.log('SW registration failed: ', registrationError);
					});
			});
		}
	});
</script>

<!-- Layout markup -->
<div>
	<!-- Your layout's content -->

	<slot />
	<!-- This line is crucial; it renders the child components -->
</div>
