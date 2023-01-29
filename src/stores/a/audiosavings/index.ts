import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Audiosavings extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="product-addtocart-button"]',
            render: 'text',
            outputArray: [],
        })
        this.availability = true
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*.only_regular_price',
            render: 'text',
        })
    }
}
