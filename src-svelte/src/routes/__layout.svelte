<script lang="ts">
	import '../app.css';

	window.var = (name: string) => localStorage.getItem(name)
	window.json = (name:string) => JSON.parse(localStorage.getItem(name))
</script>

<slot />
