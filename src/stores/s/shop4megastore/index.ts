import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Shop4megastore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.NET0
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
