import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Belk extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1 *[itemprop="name"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1 *[itemprop="name"]',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'img.vjs_dri',
            render: 'src',
            multiple: true,
        })
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
            selector1: 'span[itemprop="price"]',
            selector2: 'div.price-standard, span.standardprice',
            render: 'text',
        })
    }
}
