import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Shopbecker extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product__name')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'main[id="content"] button[data-cart-name="ShoppingCart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.product__priceBlock *.price--sale *.price__value',
            selector2: 'div.product__priceBlock *.price--default *.price__value',
            render: 'text',
        })
    }
}
