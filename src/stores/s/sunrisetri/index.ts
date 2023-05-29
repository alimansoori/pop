import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Sunrisetri extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-ui="product-information-title"]')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.seZoomImageContainer',
            type: 'regex',
            render: 'text',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
