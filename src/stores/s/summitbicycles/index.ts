import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Summitbicycles extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-ui="product-information-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'content',
        })
    }
}
