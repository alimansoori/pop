import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Groupon extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[id="deal-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[id="add-to-cart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.price-discount-wrapper',
            selector2: 'div[class="pricing-options-wrapper"]  div[class="breakout-option-value"]',
            render: 'text',
        })
    }
}
