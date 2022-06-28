<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { execTag } from '$lib/tags';
	import type { CharacterSpeech, SceneTree } from '$lib/types';
	import { parseScene } from '$lib/utils';
	import { onMount } from 'svelte';

	let sceneTree: SceneTree;

	async function load() {
		const path = $page.url.searchParams.get('scene');
		console.log('Loading scene at: ' + path);

		sceneTree = await parseScene(path);
		console.log('Scene size: ', sceneTree.length);
		console.log(sceneTree);
		try {
			nextEvent();
			nextEvent();
			document.addEventListener('keyup', (e) => {
				if (e.key === 'Enter') nextEvent();
			});
		} catch (e) {
			console.error(e);
			console.log(sceneTree);
		}
	}

	let currentCharacter: CharacterSpeech = {
		lines: [],
		name: '',
		emotion: '',
		type: 'character'
	};
	let currentLine: string;

	function nextEvent() {
		const tag = sceneTree.shift();
		if (!tag && currentCharacter.lines.length < 1) return goto('/');
		console.log(tag);
		if (tag.type == 'tag') return execTag(tag);
		else currentCharacter = tag;
		currentLine = currentCharacter.lines.shift();
	}

	onMount(load);
</script>

<div class="frame" />

{#if currentCharacter}
	<div
		style="width: 100%; height: 22vh;"
		class="py-4 px-5 bg-black bg-opacity-70 absolute bottom-0 text-white flex flex-col gap-4"
	>
		{#if currentCharacter.name != 'Narrator'}
			<h3 class="font-semibold">{currentCharacter.name}</h3>
		{/if}
		<p>{currentLine}</p>
	</div>
{/if}
