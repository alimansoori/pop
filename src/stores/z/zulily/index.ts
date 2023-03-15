import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-23-2023
export default class Zulily extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        /*this.excludeAssets = [
            'https://www.zulily.com/mainpanel/recently_viewed',
            'https://cfcdn-skin.zulily.com/js/cache',
        ]*/
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('script.structured-data[type="application/ld+json"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
