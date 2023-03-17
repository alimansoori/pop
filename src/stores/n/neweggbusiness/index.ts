import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Neweggbusiness extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h2[id="ItemDescComponent"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector:
                'div#main div#product div.item-product > div.item-group div.item-info-group link[itemprop="availability"]',
            render: 'href',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div#product meta[itemprop="price"]',
            render: 'content',
        })
    }
}
