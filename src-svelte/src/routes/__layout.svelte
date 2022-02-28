<script lang="ts">
	import '../app.css';

	window.var = (name: string) => localStorage.getItem(name)
</script>

<slot />
