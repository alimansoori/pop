import GoogleSheets from "./sheets/GoogleSheets";
import {askQuestion} from "./lib/helper";

export async function main() {
    const settingFile = await askQuestion("Which setting file? ")
    try {
        await run(settingFile)
    } catch (e: any) {
        await run(settingFile)
    }
}

export async function run(settingFile: string|unknown) {
    try {
        new GoogleSheets(settingFile)
    } catch (e: any) {
        await run(settingFile)
    }
}

main()

// netstat -ano | findstr :3000
// tskill typeyourPIDhere
// git reset --hard