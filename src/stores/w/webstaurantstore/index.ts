import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Webstaurantstore extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        this.excludeAssets = ['https://www.webstaurantstore.com/build/']
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-testid="product-detail-heading"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
