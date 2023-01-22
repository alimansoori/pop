import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Titangamesonline extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-page')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[itemprop="availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[itemprop="price"]',
            render: 'content',
        })
    }
}
