<script lang="ts">
	import { page } from '$app/stores';
	import { input, sceneTree } from '$lib/stores';
	import { execTag } from '$lib/tags';
	import type { CharacterSpeech, SceneTree } from '$lib/types';
	import { insertVariables, parseScene } from '$lib/utils';
	import Modal from '$src/components/Modal.svelte';
	import { onMount } from 'svelte';

	let tree: SceneTree;

	async function load() {
		const path = $page.url.searchParams.get('scene');
		console.log('Loading scene at: ' + path);

		sceneTree.subscribe((changedTree) => {
			console.log('tree changed:');
			console.log(tree);
			tree = changedTree;
		}); // Auomatically go to next event when the tree changes

		sceneTree.set(await parseScene(path));

		document.onkeydown = (e) => {
			if (e.key === 'Enter') nextEvent();
		};

		console.log('Scene size: ', tree.length);
		console.log(tree);
		nextEvent();
	}

	let currentCharacter: CharacterSpeech;
	let currentLine: string;

	function nextEvent() {
		if ($input.show) return;
		const tag = tree.shift();
		console.log('tag:');
		console.log(tag);
		if (!tag && currentCharacter.lines.length < 1) return (location.href = '/');
		if (tag.type == 'tag') {
			console.log(tag.name);
			execTag(tag);
			nextEvent();
			return;
		} else currentCharacter = tag;
		let line = currentCharacter.lines.shift();
		currentLine = insertVariables(line);
	}

	function submitInput(next: boolean = false) {
		console.log('submitting input', next);
		localStorage.setItem($input.name, $input.value);
		input.set({ show: false, name: '', value: '', prompt: '' });
		nextEvent();
	}

	onMount(load);
</script>

<Modal bind:show={$input.show} closable={false}>
	<div slot="modal-inner" class="py-2">
		<form action="" on:submit|preventDefault|stopPropagation={(_) => submitInput(false)}>
			<h3 class="text-xl mx-3 text-left">{$input.prompt}:</h3>
			<input type="text" class="border-2 border-gray-500" bind:value={$input.value} />
			<button type="submit" on:submit={(_) => submitInput(true)}>Submit</button>
		</form>
	</div>
</Modal>

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
