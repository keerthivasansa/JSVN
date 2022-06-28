<script lang="ts">
	import { fade } from 'svelte/transition';

	export let show = false;
	export const closable: boolean = true;

	function handleMouseClick(e: MouseEvent) {
		if (!closable) return;
		let id = (e.target as HTMLElement).id;
		if (id == 'modal-outer') show = false;
	}
</script>

<div
	id="modal-outer"
	transition:fade={{
		duration: 150
	}}
	on:click={handleMouseClick}
	class="z-50 absolute {show
		? 'flex'
		: 'hidden'} flex-col items-center justify-center w-screen h-screen p-32 bg-black bg-opacity-75"
>
	<div id="modal-inner" class="bg-white max-w-xl flex-col rounded-lg">
		<div class="px-3 py-4">
			<slot name="modal-inner" />
		</div>
		<slot name="buttons" />
	</div>
</div>
