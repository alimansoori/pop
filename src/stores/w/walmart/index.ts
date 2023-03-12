import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Walmart extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.headlessRun = true
        // this.viewPageSource = false
        // this.siteIsBlocked = true
        // this.runPostman = true
        // this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
