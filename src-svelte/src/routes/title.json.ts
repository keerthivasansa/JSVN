import { parseTags } from "$lib/utils";
import { readFileSync } from "fs"

export async function get() {
    const file = readFileSync("index.jsv", "utf-8");
    return parseTags(file)
}