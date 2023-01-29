import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Wayfair extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.PdpLayoutResponsive-top h1[data-hb-id="Heading"]')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
