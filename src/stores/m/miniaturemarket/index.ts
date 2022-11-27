import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Miniaturemarket extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[class="add-to-cart"] a.button-cart:not([disabled="disabled"])',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[class="special-price"] *.price',
            render: 'text',
        })
    }
}
