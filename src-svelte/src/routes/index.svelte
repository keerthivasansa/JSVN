<script lang="ts">
	import { documentDir, join } from '@tauri-apps/api/path';
	import { listen } from '@tauri-apps/api/event';
	import { createDir, Dir, writeFile, readDir } from '@tauri-apps/api/fs';
	import { appWindow } from '@tauri-apps/api/window';
	import { onMount } from 'svelte';
	import { DEFAULT_SCENE } from '$lib/default';

	let PROJECT_DIR: string;
	let projects: string[] = [];
	let showNewProject = false;
	let projectName: string;
	$: validProject = projectName && !projects.includes(projectName);

	listen('tauri://file-drop', (event) => {
		console.log(event.payload);
		let files = event.payload as string[];
		let file = files[0];
		if (!file.endsWith('.jsv')) alert('The file is not a JSV project file');
	});

	function exitApplication() {
		appWindow.close();
	}

	async function newProjectDialog() {
		// const DOCUMENT_DIR = await documentDir();
		try {
			let docs = await readDir('JSVN', {
				dir: Dir.Document,
				recursive: true
			});
			projects = docs.map((file) => file.name);
			showNewProject = true;
            console.log(projects);
		} catch (err) {
			if ((err as string).includes('os error 3')) {
				// Folder doesn't exist
				createDir('JSVN', {
					dir: Dir.Document,
					recursive: true
				});
				newProjectDialog();
			}
		}
	}

	async function createProject() {
		let projectPath = await join(PROJECT_DIR, projectName);
        console.log({ projectPath })
		await createDir(projectPath);
		await writeFile({
			path: await join(projectPath, 'start.jsv'),
			contents: DEFAULT_SCENE
		});
        showNewProject = false;
	}

	async function load() {
		let docDir = await documentDir();
		PROJECT_DIR = await join(docDir, 'JSVN');
	}

	onMount(load);
</script>

<div
	class="z-50 absolute  {showNewProject
		? 'flex'
		: 'hidden'} items-center justify-center w-screen h-screen p-32 bg-black bg-opacity-75"
>
	<div class="bg-white max-w-xl flex-col rounded-lg">
		<form class="flex gap-5 flex-col p-5">
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
		<div class="flex flex-row">
			<button on:click={(_) => (showNewProject = false)} style="width:50%"> Cancel </button>
			<button
				style="width:50%"
                on:click={createProject}
				class="{validProject ? 'bg-black' : 'bg-gray-500'} text-white rounded-br-lg"
			>
				Create
			</button>
		</div>
	</div>
</div>

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
