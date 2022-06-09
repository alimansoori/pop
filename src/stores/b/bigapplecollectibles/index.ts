import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Bigapplecollectibles extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[data-default-text="Add to Cart"]', {timeout: 10000})
            const availability = await this.page.$eval('span[data-default-text="Add to Cart"]', elem => elem.getAttribute('data-default-text'))

            if (availability === "Add to Cart") {
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
            await this.page.waitForSelector('span[class="money"][doubly-currency="USD"]', {timeout: 5000})
            const price = textToNumber(
                await this.page.$eval('span[class="money"][doubly-currency="USD"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}