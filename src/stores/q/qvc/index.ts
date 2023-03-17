import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Qvc extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.pdShortDesc h1')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div[id="productPhoto"] img.photo',
            render: 'src',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
