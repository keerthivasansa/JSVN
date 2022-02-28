<script lang="ts">
	import type { SceneTree } from '$lib/types';

	export let sceneTree: SceneTree;

	async function load() {
		if (sceneTree[0].type == 'tag') {
			// Scene Tag
			let tag = sceneTree[0];
			if (tag.name == 'play') tag.properties.volume = 23;
		}
	}

    load();
</script>
