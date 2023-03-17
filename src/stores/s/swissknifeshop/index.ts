import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Swissknifeshop extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product__info-wrapper div.product__title > h1')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'div.product__info-wrapper div.product__title > h1',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'meta[property="og:image"]',
            render: 'content',
        })
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
