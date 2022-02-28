<script context="module"> 

</script>   

<script lang="ts">
    import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"

    let options = {
        display:false, 
        selected: "General"    
    };
    const titleScreen = {
        title: window.var("title") ?? "JSVN Demo",
        background: window.var("background") ?? "https://images.gnwcdn.com/2020/usgamer/Xenoblade-Chronicles-Definitive-Edition-Title-Screen-Screenshot2-06112020.jpg/EG11/thumbnail/1920x1080/format/jpg/quality/65/the-20-best-video-game-start-title-screens.jpg", 
        disabledMenuOptions: ["Continue"]
    }

    async function load() {
        let intro = await readTextFile("intro.jsv", {
            dir: BaseDirectory.App
        })    
        console.log(intro);
    
    }

    function menuSelect(option:string) {
        switch(option) {
            case "Start":
                alert("Welcome to the JSVN Demo game");
                break
            case "Options":
                options.display = true
                break
        }
    }

    load();
</script>

<svelte:head>
    <title>{titleScreen.title}</title>
</svelte:head>

<!-- Options Modal -->
<div id="options-modal" class="m-10 h-full w-full z-50 absolute font-mono {options.display ? "visible" : "hidden"} flex-row rounded-lg px-10 py-3 bg-black bg-opacity-90 text-white">
    <span on:click={_ => options.display = false} class="text-md clickable bg-red-800 px-3 font-bold py-1 rounded-full absolute right-5 top-5">x</span>
    <div class="flex flex-col gap-10">  
        {#each ['General'] as sectionTitle}
            <span class="clickable" on:click={_ => options.selected = sectionTitle}>{sectionTitle}</span>
        {/each}
    </div>
    <div class="flex py-3 px-2 flex-col gap-5">
        {#if options.selected == "General"}
            <span class="clickable"> Awefpo</span>
        {/if}
    </div>
</div>

<main class="w-screen h-screen object-cover text-2xl" style="background-image: url({titleScreen.background});">
   
    <h1 class="text-4xl absolute top-10 left-48 font-extrabold">{titleScreen.title}</h1>
   
    <div id="menu" class="bg-slate-800 text-white rounded-lg flex flex-col absolute justify-center text-center left-10 top-52 p-10 py-24 gap-8 bg-opacity-75">
        
        {#each ['Start', "Continue", 'Options', 'Exit'] as option}
            {#if titleScreen.disabledMenuOptions.includes(option)}
                <span class="text-gray-500">{option}</span>
            {:else}
                <span class="cursor-pointer" on:click={_ => menuSelect(option)}>{option}</span>
            {/if}
        {/each}
  
    </div>
</main>

<style>
    .clickable {
        cursor: pointer;
    }

    #menu {
        min-width: 25vw;
    }

    main {
        font-family: 'Fira Mono';
        font-weight: 500;
    }
</style>