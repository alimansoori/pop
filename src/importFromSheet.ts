import GoogleSheets from './sheets/GoogleSheets'
import { askQuestion } from './lib/helper'
import ImportFromGoogleSheet from './sheets/ImportFromGoogleSheet'

export async function importFromSheet() {
    const whichSettingFile = await askQuestion('Which setting file? ')
    try {
        await run(whichSettingFile)
    } catch (e: any) {
        await run(whichSettingFile)
    }
}

export async function run(settingFile: string | unknown) {
    try {
        new ImportFromGoogleSheet(settingFile)
    } catch (e: any) {
        await run(settingFile)
    }
}

importFromSheet()
