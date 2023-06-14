import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Walmart extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"]', 15000)
    }

    /*async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1[itemprop="name"]',
            render: 'text',
        })
    }*/

    /*async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div[data-testid="hero-image-container"] img',
            render: 'src',
            multiple: true,
        })
    }*/

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    /*async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div[data-testid="add-to-cart-section"] div[data-testid="atc-buynow-container"] button',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemprop="price"]',
            render: 'text',
        })
    }*/
}
