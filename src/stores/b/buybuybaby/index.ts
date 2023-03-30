import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Buybuybaby extends Store {
    constructor(url: string) {
        super(url)
        this.url = this.getUrl().replace(/(\/amp)/g, '')
        this.url = this.getUrl().replace('buybuybaby.com', 'buybuybaby.com/amp')
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.prodTitle')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"][id="pdpSchemaGraph"]')
    }
}
