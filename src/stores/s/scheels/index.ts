import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Scheels extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div[id="product-content"] *[itemprop="availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="product-content"] *[itemprop="price"]',
            render: 'text',
        })
    }
}
