import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Boscovs extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector(
            'div[class="product-wrapper"] div[class="mz-product-top-content"] h1[itemprop="name"]'
        )
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="add-to-cart"]:not(.button_disabled)',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'text',
        })
    }
}
