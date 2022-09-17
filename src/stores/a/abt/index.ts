import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Abt extends Store {
    constructor(page: Page, url: string) {
        super(page, url)

        this.addPriceSelector({
            selector: 'div.product-page_info div.pricing-item-price > span',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
