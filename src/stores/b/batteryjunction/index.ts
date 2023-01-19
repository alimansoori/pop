import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Batteryjunction extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.item-name')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[id="ysw-add-to-cart"]',
            render: 'value',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'content',
        })
    }
}
