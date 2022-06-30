<script lang="ts">
	import { page } from '$app/stores';
	import { input } from '$lib/stores';
	import { execTag } from '$lib/tags';
	import type { CharacterSpeech, SceneTree } from '$lib/types';
	import { insertVariables, parseScene } from '$lib/utils';
	import Modal from '$src/components/Modal.svelte';
	import { onMount } from 'svelte';

	let sceneTree: SceneTree;

	async function load() {
		const path = $page.url.searchParams.get('scene');
		console.log('Loading scene at: ' + path);

		sceneTree = await parseScene(path);
		console.log('Scene size: ', sceneTree.length);
		console.log(sceneTree);
		try {
			if (sceneTree[0].type == 'tag' && sceneTree[0].name == 'scene') nextEvent(); // reading the scene tag if any
			document.addEventListener('keyup', (e) => {
				if (e.key === 'Enter') {
					console.log(e)
					console.log('Enter pressed');
					nextEvent();
				}
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
		if ($input.show) return;
		const tag = sceneTree.shift();
		console.log('tag:');
		console.log(tag);
		if (!tag && currentCharacter.lines.length < 1) return (location.href = '/');
		if (tag.type == 'tag') {
			execTag(tag);
			nextEvent();
			return;
		} else currentCharacter = tag;
		let line = currentCharacter.lines.shift();
		currentLine = insertVariables(line);
	}

	function submitInput(next:boolean = false) {
		console.log("submitting input", next);
		localStorage.setItem($input.name, $input.value);
		input.set({ show: false, name: '', value: '', prompt: '' });
		if (next)
			nextEvent();
	}

	input.subscribe((state) => console.log(state));

	onMount(load);
</script>

<Modal bind:show={$input.show} closable={false}>
	<div slot="modal-inner" class="py-2">
		<form action="" on:submit|preventDefault|stopPropagation={_ => submitInput(false)}>
			<h3 class="text-xl mx-3 text-left">{$input.prompt}:</h3>
			<input
				type="text"
				class="border-2 border-gray-500"
				bind:value={$input.value}
			/>
			<button type="submit" on:submit={_ => submitInput(true)}>Submit</button>
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
