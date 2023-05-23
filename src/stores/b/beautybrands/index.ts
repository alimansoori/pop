import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Beautybrands extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('*[itemprop="name"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: '*[itemprop="name"]',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.ml-product-wrapper img[id="mainimage"]',
            render: 'src',
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
            selector1: 'meta[itemprop="price"]',
            render: 'content',
        })
    }
}
