import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Alltimetoys extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

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
