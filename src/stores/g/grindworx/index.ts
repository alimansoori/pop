import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Grindworx extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button.addToCart',
            render: 'text',
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"] *.price',
            render: 'text',
        })
    }
}
