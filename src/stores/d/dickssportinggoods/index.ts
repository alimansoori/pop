import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Dickssportinggoods extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.viewPageSource = false
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="title"][itemprop="namee"]')
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
