import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class Tactical extends Store {
    constructor(url: string) {
        super(url)

        this.addPriceSelector({
            selector: 'div.product-info-price span.price',
            attr: 'text',
        })
    }

    async productExistCalculate(): Promise<void> {}
}
