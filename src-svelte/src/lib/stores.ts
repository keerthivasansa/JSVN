import { writable } from "svelte/store";

export const projectPath = writable("");

export const input = writable({
    show: false,
    prompt: "",
    name: "",
    value: "",
})