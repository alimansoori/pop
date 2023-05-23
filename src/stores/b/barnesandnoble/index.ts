import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Barnesandnoble extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="pdp-header-info"] > h1[itemprop="name"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'div[id="pdp-header-info"] > h1[itemprop="name"]',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div[id="productDetail-container"] img[itemprop="image"], div[id="productDetail-container"] img',
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
            selector1: '*[itemprop="price"]',
            render: 'text',
        })
    }
}
