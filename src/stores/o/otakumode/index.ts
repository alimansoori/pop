import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Otakumode extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('*.p-product-detail__summary h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'a[data-track-action="add_to_cart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[class="p-product-detail__sku"] span[class="p-price__price"]',
            render: 'text',
        })
    }
}
