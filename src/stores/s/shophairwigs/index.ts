import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Shophairwigs extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        // this.runPostman = true
        // this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1 *[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'link[itemprop="availability"]',
            render: 'href',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[itemprop="price"]',
            render: 'content',
        })
    }
}
