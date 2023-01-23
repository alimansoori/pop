import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Gemplers extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.pdp_product_wrapper h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="AddToCart-product-template"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*.product-price',
            render: 'content',
        })
    }
}
