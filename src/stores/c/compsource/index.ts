import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Compsource extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h2.product-name')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'main div[itemtype="https://schema.org/Product"] > meta[itemprop="name"]',
            render: 'content',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '*[itemprop="image"]',
            render: 'content',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[itemprop="availability"]',
            render: 'content',
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
