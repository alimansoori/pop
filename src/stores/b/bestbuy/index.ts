import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bestbuy extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[class="sku-title"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[data-button-state="ADD_TO_CART"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1:
                'div[data-sticky-media-gallery="enabled"] div[class="priceView-hero-price priceView-customer-price"] > span[aria-hidden="true"]',
            render: 'text',
        })
    }
}
