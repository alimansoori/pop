import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bedbathandbeyond extends Store {
    constructor(url: string) {
        super(url)
        this.url = url.replace('bedbathandbeyond.com/amp', 'bedbathandbeyond.com')
        this.url = url.replace('bedbathandbeyond.com', 'bedbathandbeyond.com/amp')
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.prodTitle')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[data-cta="pdpPickIt"]',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.priceBplus.bold > span',
            selector2: 'div.trackIsPrice.bold',
            render: 'text',
        })
    }
}
