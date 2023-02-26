import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Abesofmaine extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('*[itemprop="name"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: '*[itemprop="name"]',
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
            selector1: '*[itemprop="price"]',
            render: 'content',
        })
    }
}
