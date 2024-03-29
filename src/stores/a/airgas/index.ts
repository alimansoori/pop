import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Airgas extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-information h2')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        await this.checkAvailability({
            selector: 'button[data-enable-add-to-cart="true"]',
            render: 'text',
            outputArray: [],
        })
    }
}
