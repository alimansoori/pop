import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { MyPuppeteerCalculate } from '../../../lib/MyPuppeteerCalculate'

export default class Dickblick extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[data-testid="skuname"]')
        if (await MyPuppeteerCalculate.findElementByContent(this.page, 'Page Not Found')) {
            this.statusCode = 404
            this.pageNotFound = true
        }
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
