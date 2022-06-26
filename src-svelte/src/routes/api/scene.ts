
import { parseScene } from '$lib/utils'
import { readFileSync } from "node:fs"
import type { RequestHandler } from '@sveltejs/kit/types'

export const get: RequestHandler = ({ url }) => {
    const name = url.searchParams.get("name")
    let path = url.searchParams.get("path");
    path ??= process.env.PROJECT_PATH + "/" + name
    
    const content = readFileSync(path, "utf-8");
    return {
        body: parseScene(content), 
        status: 200,

    }
}