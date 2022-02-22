import { join } from "path"
import { existsSync, writeFileSync } from "fs"
import { parseScene } from "./src-svelte/src/lib/utils"

if (!process.env.PROJECT_PATH)
    process.env.PROJECT_PATH = process.argv[1];


console.log("Compiling project from: " + process.env.PROJECT_PATH);

function selectOneOf(files) {
    for (let i = 0; i < files.length; i++) {
        let filePath = join(process.env.PROJECT_PATH, files[i])
        if (existsSync(filePath))
            return filePath
    }
    throw new Error("One of the files: " + files.join(", ") + " must be present in the location: "+  process.env.PROJECT_PATH);
}

let scenesCompiled = [];
function writeScene(path) {
    const tree = parseScene(path);
    tree.forEach((prop) => {
        if (prop.type == "tag" && prop.name == "goto") {
            let scene = prop.properties.scene;
            if (scenesCompiled.includes(scene)) // If the scene is already compiled, don't - prevents infinite looping
                return
            let path = join(process.env.PROJECT_PATH, prop.properties.scene)
            writeScene(path);
        }
    })
    writeFileSync(path + ".json", JSON.stringify(tree), "utf-8")
}

const startingScenePath = selectOneOf(["index.jsv", "start.jsv"])

writeScene(startingScenePath);
