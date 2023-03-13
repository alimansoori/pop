import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Newegg extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.includeAssets = [/https:\/\/c1.neweggimages.com\/webResource\/Scripts\/WWW\/jquery/]
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
