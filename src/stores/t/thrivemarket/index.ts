import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Thrivemarket extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.enableCanonical = false
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-testid="pdp-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'span[itemprop="availability"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[property="og:price:amount"]',
            render: 'content',
        })
    }
}
