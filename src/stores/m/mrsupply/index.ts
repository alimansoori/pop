import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Mrsupply extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.mr_title-product h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div[id="product"] button[title="Add to cart"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[mr_itemprop="price"]',
            render: 'text',
        })
    }
}
