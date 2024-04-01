<script>
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/sw.js');
		});
	}
</script>

<!-- Layout markup -->
<div>
	<!-- Your layout's content -->

	<slot />
	<!-- This line is crucial; it renders the child components -->
</div>
