import { writable, type Writable } from "svelte/store";
import type { SceneTree } from "./types";

export const projectPath = writable("");

export const input = writable({
    show: false,
    prompt: "",
    name: "",
    value: "",
})

export const sceneTree: Writable<SceneTree> = writable([]);