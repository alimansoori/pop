import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

// 1-20-2023
export default class Bestbuy extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[class="sku-title"] h1, h2.product-title > a')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: '*[itemprop="name"] > h1',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'meta[property="og:image"]',
            render: 'content',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'button[data-button-state="ADD_TO_CART"], button.add-to-cart-button',
            render: 'text',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1:
                'div[data-sticky-media-gallery="enabled"] div[class="priceView-hero-price priceView-customer-price"] > span[aria-hidden="true"], div.product-info-and-price-block div.pricing-price div[class="priceView-hero-price priceView-customer-price"] > span[aria-hidden="true"]',
            render: 'text',
        })
    }
}
