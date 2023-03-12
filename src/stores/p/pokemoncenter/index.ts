import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Pokemoncenter extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.NET2
        // this.siteIsBlocked = true
        this.headlessRun = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="product"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
