import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Popinabox extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[data-component="productAddToBasket"]', {timeout: 10000})
            const availability = await this.page.$eval('button[data-component="productAddToBasket"]', elem => elem.getAttribute('aria-label'))

            if (availability === 'Add to Cart') {
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
            await this.page.waitForSelector('p[data-product-price="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('p[data-product-price="price"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}