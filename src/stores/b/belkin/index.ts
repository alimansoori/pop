import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Belkin extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-name-block')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.product-name-block',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.main-carousel-container img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[property="og:availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[property="og:price:amount"]',
            render: 'content',
        })
    }
}
