import { goto } from "$app/navigation";
import { window } from "@tauri-apps/api";
import { join } from "@tauri-apps/api/path";
import { convertFileSrc, transformCallback } from "@tauri-apps/api/tauri";
import { input, projectPath } from "./stores";
import type { TagTypes } from "./tagTypes";
import type { SceneTree, Tag } from "./types";
import safeEval from "safe-evaluate-expression"
import { sceneTree } from "./stores"

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
    'if': ['condition']
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
    },
    'if': (props: TagTypes['if']) => { // TODO Handle nested if, else if and other cases
        let ifBlock = []
        let changeTree = (tree: SceneTree) => {
            let elseIndex = -1;
            tree.forEach((prop, index) => {
                if (prop.name == 'else')
                    elseIndex = index;
                else if (prop.name == 'endif') {
                    if (safeEval(props.condition, localStorage))
                        if (elseIndex != -1)
                            ifBlock = tree.slice(0, elseIndex);
                        else
                            ifBlock = tree.slice(0, index)
                    else if (elseIndex != -1)
                            ifBlock = tree.slice(elseIndex + 1, index);
                    tree = ifBlock.concat(tree.slice(index + 1))
                    changeTree = () => null
                    sceneTree.set(tree);
                }
            })
        }
        const unsub = sceneTree.subscribe(changeTree);
        unsub();
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