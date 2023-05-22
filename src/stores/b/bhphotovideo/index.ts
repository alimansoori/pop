import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-25-2023
export default class Bhphotovideo extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-selenium="productTitle"]')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.bh-preloaded-data',
            type: 'regex',
            render: 'data-data',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
