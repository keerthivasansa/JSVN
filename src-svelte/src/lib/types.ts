import type { TagTypes } from "./tagTypes"

type TagName = keyof TagTypes;

interface Tag<Name extends TagName> {
    type: "tag",
    name: Name, 
    inline ?: boolean
    properties: TagTypes[Name]
}

interface CharacterSpeech {
    type: "character",
    emotion ?: string, 
    name: string, 
    lines: string[]
}

type SceneProp =  Tag<"scene"> | Tag<"play"> | Tag<"play"> | CharacterSpeech;
type SceneTree = SceneProp[];

export type { SceneProp, SceneTree, TagName }