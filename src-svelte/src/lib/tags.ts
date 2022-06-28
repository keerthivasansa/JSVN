import { goto } from "$app/navigation";
import { window } from "@tauri-apps/api";
import { join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { input, projectPath } from "./stores";
import type { TagTypes } from "./tagTypes";
import type { Tag } from "./types";

type f<k extends string> = (props: TagTypes[k]) => void

interface TagExecMap {
    [k: string]: f<typeof k>
}

const inlineMap = {
    'scene': ['name', 'background'],
    'goto': ['scene', 'label'],
    'play': ['media', 'volume'],
    'set': ['name', 'value'], 
    'input': ['name', 'prompt', 'type'],
}

const tags: TagExecMap = {
    'scene': async (props: TagTypes['scene']) => {
        if (props.name)
            window.appWindow.setTitle(props.name)
        if (props.bgmusic) {
            let aud = document.createElement('audio');
            aud.src = props.bgmusic
            aud.loop = true
            try {
                await aud.play();
            } catch (er) {
                console.error(er);
            }
        }
        if (props.background) {
            projectPath.subscribe(async path => {
                console.log(path);
                let fullPath = await join(path, "assets", "images", props.background)
                let bgUrl = convertFileSrc(fullPath)
                console.log(bgUrl)
                document.body.style.backgroundImage = `url('${bgUrl}')`
            })
        }
    },
    'goto': (props: TagTypes['goto']) => {
        const params = new URLSearchParams({
            scene: props.scene,
            label: props.label
        })
        let url = "/scene?" + params.toString();
        console.log("Moving to scene: " + url);
        goto(url);
    },
    'set': (props: TagTypes['set']) => {
        localStorage.setItem(props.name, props.value)
    },
    'input': (props: TagTypes['input']) => {
        input.set({
            show: true,
            value: '',
            name: props.name,
            prompt: props.prompt,
        })
        console.log(props)

    }
}

export function execTag(tag: Tag<string>) {
    if (tag.inline && tag.name in inlineMap) {
        tag.properties = {}
        tag.value.forEach((val, i) => {
            tag.properties[inlineMap[tag.name][i]] = val
        })
    }
    tags[tag.name](tag.properties)
}