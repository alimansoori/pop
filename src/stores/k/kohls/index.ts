import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Kohls extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[itemprop="availability"]', {timeout: 10000})
            const availability = await this.page.$eval('meta[itemprop="availability"]', elem => elem.getAttribute('content'))

            if (availability === "http://schema.org/InStock") {
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
            await this.page.waitForSelector('meta[itemprop="price"]', {timeout: 5000})
            const price = textToNumber(
                await this.page.$eval('meta[itemprop="price"]', elem => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}