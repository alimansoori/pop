import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Nutriessential extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.product-form--atc-button',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product-details div.price__current > span.money',
            render: 'text',
        })
    }
}
