enum FocusMode { MULTIPLE, SINGLE }

interface Tag {
    inlineValue?: string
    [property: string]: string | number | boolean
}

interface TagTypes extends Record<string, Tag> {
    scene: {
        background: string,
        bgmusic: string,
        name: string
    },
    play: {
        name: string,
        fadeIn: boolean,
        fadeOut: boolean,
        volume: number,
    },
    if: {
        condition: string,
    },
    goto: {
        scene: string,
        label: string
    }
}

export type { TagTypes, FocusMode }