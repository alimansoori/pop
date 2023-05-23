import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bellacor extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.pdp-main__details h1.pdp__name')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.product__image-view img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
