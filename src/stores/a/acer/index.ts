import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Acer extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.card__title')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')

        await this.checkAvailability({
            selector: '*[id="addToCartForm"] div.card__cart--pdp-product > button',
            render: 'text',
            outputArray: [],
        })
    }
}
