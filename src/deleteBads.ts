import { askQuestion } from './lib/helper'
import Doc from './sheets/Doc'

export async function deleteBads() {
    const whichSettingFile = await askQuestion('Which setting file? ')
    try {
        await run(whichSettingFile)
    } catch (e: any) {
        await run(whichSettingFile)
    }
}

export async function run(settingFile: string | unknown) {
    try {
        new Doc(settingFile)
    } catch (e: any) {
        await run(settingFile)
    }
}

deleteBads()
