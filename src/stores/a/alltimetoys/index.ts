import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Alltimetoys extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1 *[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div[title="Availability"] > span',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[class="product-info-main"] *[data-price-type="finalPrice"]',
            render: 'data-price-amount',
        })
    }
}
