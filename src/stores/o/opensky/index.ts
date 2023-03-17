import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Opensky extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.sellable-detail-section')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[class="add-to-cart-text"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[id="current-price"]',
            render: 'text',
        })
    }
}
