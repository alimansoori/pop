import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bornshoes extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.product-name')
    }

    /*async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.expose-alt-images-media img',
            render: 'src',
            multiple: true,
        })
    }*/

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
