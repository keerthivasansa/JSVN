<script lang="ts">
	export let show = false;

    function handleMouseClick(e: MouseEvent) {
        let id = e.target.id
        if (id == "modal-outer")
            show = false;
    }
</script>

<div
    id="modal-outer"
    on:click={handleMouseClick}
	class="z-50 absolute {show ? 'flex' : 'hidden'} items-center justify-center w-screen h-screen p-32 bg-black bg-opacity-75"
>
	<div id="modal-inner" class="bg-white px-4 py-5 max-w-xl flex-col rounded-lg">
		<slot />
	</div>
</div>
