import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Hasbropulse extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-form__header-title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.product-form__add-to-cart > span',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[js-product-form="price"]',
            render: 'text',
        })
    }
}
