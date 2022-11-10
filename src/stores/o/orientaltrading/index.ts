import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Orientaltrading extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="pdp_main_item_details"] h1')
    }

    async productTitleCalculate(): Promise<void> {
        // this.titleClass.setTitle("ffff");
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
