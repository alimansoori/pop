import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Homedepot extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-details__badge-title--wrapper h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.setAvailability(true)
    }

    async priceCalculate(): Promise<void> {
        if (!this.getPrice()) {
            await this.checkPrice({
                selector1: 'div.price-detailed__wrapper div.price-format__main-price span:nth-child(2)',
                render: 'text',
            })
        }
    }
}
