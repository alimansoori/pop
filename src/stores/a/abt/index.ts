import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class Abt extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'div.product-page_info div.pricing-item-price > span',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
