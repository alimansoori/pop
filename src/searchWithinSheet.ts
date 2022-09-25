import GoogleSheets from './sheets/GoogleSheets'
import { askQuestion } from './lib/helper'

export async function startSearchWithinSheet() {
    const whichSettingFile = await askQuestion('Which setting file? ')
    try {
        await run(whichSettingFile)
    } catch (e: any) {
        await run(whichSettingFile)
    }
}

export async function run(settingFile: string | unknown) {
    try {
        new GoogleSheets(settingFile)
    } catch (e: any) {
        await run(settingFile)
    }
}

startSearchWithinSheet()

// netstat -ano | findstr :3000
// tskill typeyourPIDhere
// git reset --hard
