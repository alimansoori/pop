import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Gardenersedge extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
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

    /*async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '',
            render: '',
        })
    }*/

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'meta[property="product:availability"]',
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
