import { readFileSync } from "fs"
import type { SceneTree } from "./types";

const tag = /---?([\w\W]*?)---?/g
const inlineTag = /(\w+):([\w\W]+)/g

function parseTag(content:string) {
    let properties: Record<string, string | boolean> = { type: "tag" };
    if (content.includes('\n')) {
        let lines = content.split('\n').map(line => line.trim()).filter(line => line != '');
        properties['tag'] = lines[0];
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(":");
            properties[parts[0].toLowerCase()] = parts[1];
        }
    } else {
        let inlineMatch = content.matchAll(inlineTag);
        let inlineMatchArr = Array.from(inlineMatch)[0]
        if (!inlineMatchArr)
            console.log(content)
        let tagName = inlineMatchArr[1].toLowerCase();
        let value = inlineMatchArr[2];
        properties.tag = tagName 
        properties.inline = true
        properties.value= value ;
    }
    return properties;
}

function parseScene(scenePath:string): SceneTree {
    let content = readFileSync(scenePath, "utf-8");
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
    let lines = content.split('\n').map(line => line.trim()).filter(line => line != '');
    let sceneTree = [];
    lines.forEach((line, _) => {
        let tagMatch = Array.from(line.matchAll(/__tag(\d)__/g))
        if (tagMatch?.[0])
            return sceneTree.push(tags[tagMatch[0][1]]);
        let parts = line.split(":").map(part => part.trim());
        if (parts.length < 2) // If it's not a new character, add it to the lines of the previous speaker
            return sceneTree[sceneTree.length - 1].lines.push(parts[0]) 
        
        let character = parts[0];
        let speechText = parts[1];

        let characterParts = character.split('/');
        character = characterParts[0]; // Either way, assign the first part as character name

        let emotion:string;
        if (characterParts.length > 1) // Emotion is given
            emotion = characterParts[1]
        else
            emotion = ''
        
        sceneTree.push({ type: "character", emotion, character,  lines:[speechText] })
    })
    return sceneTree;
}

export { parseScene }