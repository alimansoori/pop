import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Ajmadison extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('meta[itemprop="availability"]')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'div.divided h1',
            render: 'text',
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