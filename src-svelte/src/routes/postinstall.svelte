<script lang="ts">
	import { Command } from '@tauri-apps/api/shell';

	let vscodeExists;

	async function load() {
		try {
			vscodeExists = await new Command('time').execute();
			console.log(vscodeExists);
		} catch (err) {
			if (err == "program not found")
                vscodeExists = "Program doesn't exist";
		}
	}

	load();
</script>

<main>
	{vscodeExists}
</main>
