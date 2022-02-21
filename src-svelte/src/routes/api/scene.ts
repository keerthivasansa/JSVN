
import { parseScene } from '$lib/utils'
import { readFileSync } from "node:fs"
import type { RequestHandler } from '@sveltejs/kit/types'

export const get: RequestHandler = ({ url }) => {
    const name = url.searchParams.get("name")
    const content = readFileSync(process.env.PROJECT_PATH + "/" + name, "utf-8");
    return {
        body: parseScene(content), 
        status: 200
    }
}