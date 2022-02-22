enum FocusMode { MULTIPLE, SINGLE }

interface Tag {
    inlineValue ?: string
    [property:string]: string | number | boolean
}

const inlineValues = {
    goto: "scene"
}

interface TagTypes extends Record<string, Tag> {
    scene: {
        background:string, 
        bgmusic:string,
        name:string, 
        focusMode: FocusMode, 
    }, 
    play: {
        fadeIn: boolean, 
        fadeOut: boolean, 
        volume: number,
    }, 
    if: {
        condition:string, 
    }, 
    goto: {
        scene: string, 
        label: string
    }
}

export type { TagTypes, FocusMode }