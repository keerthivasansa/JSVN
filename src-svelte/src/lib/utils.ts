import { Dir, readTextFile } from "@tauri-apps/api/fs";
import type { SceneTree } from "./types";

const tag = /---?([\w\W]*?)---?/g
const varReg = /{{([\w\W]+?)}}/ig

function parseTag(content: string) {
    let tag: Record<string, any> = { type: "tag" };
    if (content.includes('\n')) {
        let lines = content.split('\n').map(line => line.trim()).filter(line => line != '');
        tag['name'] = lines[0].toLowerCase();
        tag.properties = {};
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(":").map(p => p.trim());
            tag.properties[parts[0].toLowerCase()] = parts[1];
        }
    } else {
        let parts = content.split(':').map(d => d.trim());
        tag.name = parts.shift().toLowerCase();
        tag.value = parts
        tag.inline = true;
    }
    return tag;
}

async function parseScene(scenePath: string): Promise<SceneTree> {
    let content = await readTextFile(scenePath, {
        dir: Dir.Document
    });
    let tagContent = content.matchAll(tag);
    const tags = [];
    Array.from(tagContent).forEach(match => {
        let tag = parseTag(match[1]);
        let length = match[0].length;
        let stop = length + match.index;
        // padding so that the index matches of later tags stay correct
        content = content.slice(0, match.index) + (`__tag${tags.length}__`.padEnd(length, " ") + content.slice(stop));
        tags.push(tag)
    })
    // Now that all tags are extracted, create dialog sequence
    let lines = content.split('\n').map(line => line.trim()).filter(line => line != '' && !line.startsWith('#'));
    let sceneTree = [];
    lines.forEach((line, _) => {
        let tagMatch = Array.from(line.matchAll(/__tag(\d)__/g))
        if (tagMatch?.[0])
            return sceneTree.push(tags[tagMatch[0][1]]);
        let parts = line.split(":").map(part => part.trim());
        if (parts.length < 2) // If it's not a new character, add it to the lines of the previous speaker
            return sceneTree[sceneTree.length - 1].lines.push(parts[0])

        let name = parts[0];
        let speechText = parts[1];

        let characterParts = name.split('/');
        name = characterParts[0]; // Either way, assign the first part as character name

        let emotion: string;
        if (characterParts.length > 1) // Emotion is given
            emotion = characterParts[1]
        else
            emotion = ''

        sceneTree.push({ type: "character", emotion, name, lines: [speechText] })
    })
    return sceneTree;
}

function insertVariables(line: string) {
    let result = [...line.matchAll(varReg)]

    if (result.length < 1)
        return line;

    result.forEach((match) => {
        const val = localStorage.getItem(match[1].trim());
        line = line.replaceAll(match[0], val)
    })

    console.log(line);
    return line;
}

export { parseScene, insertVariables }