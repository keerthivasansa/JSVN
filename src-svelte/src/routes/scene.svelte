<script context="module">
    export async function load({ fetch }) {

    }
</script>

<script lang="ts">
    import type {SceneTree, TagName} from "$lib/types"

    export let sceneTree:SceneTree;

    async function load() {
       if (sceneTree[0].type == "tag") { // Scene Tag 
            let tag = sceneTree[0];
            if (tag.name == "play")
                tag.properties.volume = 23;
        }
    }

</script>
