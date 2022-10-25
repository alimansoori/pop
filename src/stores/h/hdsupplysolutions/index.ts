import Store from '../../Store'

import { textToNumber } from '../../../lib/helper'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Hdsupplysolutions extends Store {
    constructor(url: string) {
        super(url)

        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector(
                'div.product-detail__description-attributes a[data-hds-tag="product-details__add-to-cart"]',
                { timeout: 10000 }
            )
            const availability = await this.page.$eval(
                'div.product-detail__description-attributes a[data-hds-tag="product-details__add-to-cart"]',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase().includes('add to cart')) {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector(
                'div.product-detail__description-attributes span[data-hds-tag="price--offerprice"]',
                { timeout: 3000 }
            )
            const price = textToNumber(
                await this.page.$eval(
                    'div.product-detail__description-attributes span[data-hds-tag="price--offerprice"]',
                    (elem: any) => elem.getAttribute('data-price')
                )
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
