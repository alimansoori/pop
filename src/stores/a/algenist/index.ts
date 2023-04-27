import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Algenist extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.prodTitle h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[property="og:price:amount"]',
            render: 'content',
        })
    }
}
