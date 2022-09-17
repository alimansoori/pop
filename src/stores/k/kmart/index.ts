import Store from '../../Store'
import { Page } from 'puppeteer'

export default class Kmart extends Store {
    constructor(page: Page, url: string) {
        super(page, url)

        this.addPriceSelector({
            selector: 'h4 > span.price-wrapper',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
