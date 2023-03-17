import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Gamestop extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[itemprop="name"],h2.product-name')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.product-main-image-gallery img.product-main-image.lazyloaded',
            render: 'src',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        if (!this.headlessRun) {
            await this.checkPrice({
                selector1: 'div[data-pp-placement="product"]',
                render: 'data-pp-amount',
            })
        } else {
            await this.checkPrice({
                selector1: '#primary-details-row > div.price-update span.actual-price > span',
                render: 'text',
            })
        }
    }
}
