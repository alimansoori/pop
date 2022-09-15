import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Thatpetplace extends Store {
    constructor(page: Page, url: string) {
        super(page, url);

    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[property="og:availability"]', {timeout: 10000})
            const availability = await this.page.$eval('meta[property="og:availability"]', elem => elem.getAttribute('content'))

            if (availability === "InStock") {
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
            await this.page.waitForSelector('span[itemprop="price"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('span[itemprop="price"]', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}