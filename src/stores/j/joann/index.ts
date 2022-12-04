import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Joann extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[data-product-component="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '[class="product-availability__item"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[data-product-container="sales-price"]',
            render: 'content',
        })
    }
}
