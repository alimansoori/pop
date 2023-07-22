import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Opentip extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product_title h1')
        await this.pageNotFoundSelector('h1[id="error"]', 100)
        this.setUPC(await this.page.$eval('*[itemprop="gtin12"]', (elem: any) => elem.textContent))
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
            selector1: '*[itemprop="price"]',
            render: 'text',
        })
    }
}
