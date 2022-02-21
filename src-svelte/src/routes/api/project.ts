import { readFileSync } from "node:fs"
import type { RequestHandler } from '@sveltejs/kit/types'

export const get: RequestHandler = ({ url }) => {
    process.env.PROJECT_PATH = url.searchParams.get("path");
    return {
        status: 200, 
        body: "Set project folder to " + process.env.PROJECT_PATH
    }
}