import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Halloweencostumes extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.prdTop__name')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}