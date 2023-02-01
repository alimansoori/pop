import { askQuestion } from './lib/helper'
import GoogleSearch from './sheets/GoogleSearch'

export async function startSearchInGoogle() {
    const whichSettingFile = await askQuestion('Which setting file? ')
    try {
        await run(whichSettingFile)
    } catch (e: any) {
        await run(whichSettingFile)
    }
}

export async function run(settingFile: string | unknown) {
    try {
        new GoogleSearch(settingFile)
    } catch (e: any) {
        await run(settingFile)
    }
}

startSearchInGoogle()
