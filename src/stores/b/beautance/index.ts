import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Beautance extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('*[id="product"] div[id="pb-left-column"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'span.availability',
            render: 'text',
            outputArray: ['available'],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[id="our_price_display"]',
            render: 'text',
        })
    }
}
