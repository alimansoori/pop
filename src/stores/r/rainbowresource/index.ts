import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Rainbowresource extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[class="addToCart_button"]', {timeout: 10000})
            const availability = await this.page.$eval('button[class="addToCart_button"]', elem => elem.textContent)

            if (availability?.includes('Add to Cart')) {
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
            await this.page.waitForSelector('div.details_desc div.price_wrapper span.price_value', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('div.details_desc div.price_wrapper span.price_value', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}