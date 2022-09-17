import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Meijer extends Store {
    constructor(page: Page, url: string) {
        super(page, url)

        this.addPriceSelector({
            selector: 'span.product-info__sale-price > span',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
