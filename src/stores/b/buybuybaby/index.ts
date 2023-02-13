import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Buybuybaby extends Store {
    constructor(url: string) {
        super(url)
        this.url = url.replace(/\/amp/gi, '')
        this.url = url.replace('buybuybaby.com', 'buybuybaby.com/amp')
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.prodTitle')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"][id="pdpSchemaGraph"]')
    }
}
