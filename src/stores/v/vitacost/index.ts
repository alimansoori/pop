import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Vitacost extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'input[id="addToCartButton"]',
            render: 'value',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="productDetail"] *[itemprop="price"]',
            render: 'text',
        })
    }
}
