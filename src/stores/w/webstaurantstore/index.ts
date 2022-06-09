import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Webstaurantstore extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('input[id="buyButton"]', {timeout: 10000})
            const availability = await this.page.$eval('input[id="buyButton"]', elem => elem.getAttribute('value'))

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
            await this.page.waitForSelector('meta[property="og:price:amount"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('meta[property="og:price:amount"]', elem => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}