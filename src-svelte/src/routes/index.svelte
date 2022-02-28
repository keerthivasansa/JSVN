<script lang="ts">
	import { documentDir, join } from '@tauri-apps/api/path';
	import { createDir, Dir, writeFile, readDir } from '@tauri-apps/api/fs';
	import { appWindow } from '@tauri-apps/api/window';
	import { onMount } from 'svelte';
	import { DEFAULT_SCENE } from '$lib/default';
	import Modal from '$src/components/Modal.svelte';

	let PROJECT_DIR: string;
	let projects: string[] = [];
	let showNewProject = false;
	let showOpenProject = false;
	let projectName: string;
	$: validProject = projectName && !projects.includes(projectName);

	function exitApplication() {
		appWindow.close();
	}

	async function newProjectDialog() {
		try {
			let docs = await readDir('JSVN', {
				dir: Dir.Document,
				recursive: true
			});
			console.log({ docs });
			projects = docs.map((file) => file.name);
			showNewProject = true;
			console.log(projects);
		} catch (err) {
			if ((err as string).includes('os error 3')) {
				createDir('JSVN', {
					dir: Dir.Document,
					recursive: true
				});
				newProjectDialog();
			}
		}
	}

	async function openProjectDialog() {
		let docs = await readDir('JSVN', {
			dir: Dir.Document,
			recursive: true
		});
		projects = docs.map((file) => file.name);

		showOpenProject = true;
	}

	async function createProject() {
		let relativeProjectPath = await join('JSVN', projectName);
		console.log({ relativeProjectPath });
		await createDir(relativeProjectPath, {
			dir: Dir.Document,
			recursive: true
		});
		console.log('Created directory: ' + relativeProjectPath);
		await writeFile(
			{
				path: await join(relativeProjectPath, 'start.jsv'),
				contents: DEFAULT_SCENE
			},
			{
				dir: Dir.Document
			}
		);
		console.log('Created default scene');
		showNewProject = false;
	}

	async function load() {
		let docDir = await documentDir();
		PROJECT_DIR = await join(docDir, 'JSVN');
	}

	onMount(load);
</script>

<Modal bind:show={showNewProject}>
	<form slot="modal-inner" class="flex gap-5 flex-col p-5">
		<h1>Create New Project</h1>
		<div>
			<span>{PROJECT_DIR}</span>
			<input
				type="text"
				bind:value={projectName}
				placeholder="Project Name"
				class="rounded-lg px-3 py-2 border-2 {validProject
					? 'border-green-300'
					: 'border-red-300'} outline-none"
				id="project-name"
				name="project-name"
				maxlength="50"
				minlength="1"
			/>
		</div>
	</form>
	<div slot="buttons" class="flex flex-row">
		<button class="bg-red-900 rounded-bl-lg text-white" on:click={(_) => (showNewProject = false)} style="width:50%"> Cancel </button>
		<button
			style="width:50%"
			on:click={createProject}
			class="{validProject ? 'bg-black' : 'bg-gray-500'} text-white rounded-br-lg"
		>
			Create
		</button>
	</div>
</Modal>

<Modal bind:show={showOpenProject}>
	<div slot="modal-inner">
		<h1 style="margin-bottom: 1.5rem;" class="text-center">Projects</h1>
		<div class="flex flex-row row-wrap gap-4">
			{#each projects as project}
				<span style="min-width: 3rem;" class="px-2 py-4 border-2 border-black rounded-lg">{project}</span>
			{/each}
		</div>
	</div>
</Modal>


<main class="p-5">
	<h1 class="text-2xl w-full text-center">JSVN</h1>
	<div class="flex flex-row flex-wrap gap-4">
		<span
			on:click={newProjectDialog}
			class="cursor-pointer p-5 border-gray-700 flex flex-col items-center rounded-lg border-2"
		>
			<img alt="" src="/New.svg" width="5vw" />
			<span>New</span>
		</span>
		<span
			on:click={openProjectDialog}
			class="cursor-pointer p-5 border-gray-700 flex flex-col items-center rounded-lg border-2"
		>
			<img alt="" src="/Open.svg" width="5vw" />
			<span>Open</span>
		</span>
		<span
			on:click={exitApplication}
			class="cursor-pointer p-5 border-gray-700 flex flex-col items-center rounded-lg border-2"
		>
			<img alt="" src="/Exit.svg" width="5vw" />
			<span>Exit</span>
		</span>
	</div>
</main>

<style type="text/postcss">
	button {
		@apply py-2 px-3;
	}
</style>
