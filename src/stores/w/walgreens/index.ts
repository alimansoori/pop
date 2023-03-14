import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'

export default class Walgreens extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
        this.excludeAssets = [
            // 'https://www.wag-static.com/common/react/assets/script.min.js',
            'https://www.walgreens.com/common/react/assets/client_bundle',
            'https://www.wag-static.com/common/react/assets/client_bundle',
            'https://www.wag-static.com/store/vpd/react/assets/client_bundle',
            'https://www.wag-static.com/common/react/assets/client_bundle',
            'https://www.wag-static.com/sameday/react/assets/client_bundle',
            'https://www.wag-static.com/store/vpd/react/assets/commons',
            'https://www.wag-static.com/store/vpd/react/assets/client_bundle',
            'https://www.wag-static.com/store/vpd/react/assets/client_bundle',
            'https://www.walgreens.com/1UjcbS',
            'https://www.wag-static.com/sameday/react/assets/client_bundle_cos',
            'https://assets.adobedtm.com/launch',
            'https://www.walgreens.com/vpd/v1/threshold',
            'https://www.walgreens.com/vpd/v1/contents',
            'https://www.walgreens.com/cartsvc/v1/items/(count)',
            /https:\/\/assets.adobedtm.com\/(.*).min.js/,
            'https://maps.googleapis.com/',
            'https://cdn.cookielaw.org/scripttemplates',
        ]
    }

    async productExistCalculate(): Promise<void> {
        // await this.productExistBySelector('*[id="productTitle"]')
        this.productExist = this.isSecond
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')

        try {
            await this.page.waitForSelector('ul.fulfillment__container > li:last-child', {
                timeout: 3000,
            })

            await this.page.click('ul.fulfillment__container > li:last-child')
            await sleep(5000)

            await this.checkAvailability({
                selector: 'ul.fulfillment__container > li:last-child:not(.disabled)',
                render: null,
                outputArray: [],
            })
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    /*async priceCalculate(): Promise<void> {
await this.checkPrice({
  selector1: '*[id="sales-price-info"]',
  render: 'text',
})
}*/
}
