import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Liftmaster extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.text-container__text-wrap form[id="addToCartForm"] > button',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div[id="productDetails"] div.text-container__text-wrap div.text-container__price',
            render: 'text',
        })
    }
}
