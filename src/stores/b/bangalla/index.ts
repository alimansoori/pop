import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bangalla extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.ProductMain h1')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'div.ProductMain h1',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.ProductThumbImage div.zoomie img,div.ProductTinyImageList img',
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
            selector1: 'meta[property="product:price:amount"]',
            render: 'content',
        })
    }
}
