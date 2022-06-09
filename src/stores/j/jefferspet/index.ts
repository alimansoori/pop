import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Jefferspet extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('meta[property="product:availability"]', {timeout: 10000})
            const availability = await this.page.$eval('meta[property="product:availability"]', elem => elem.getAttribute('content'))

            if (availability?.toLowerCase() === "instock") {
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
            await this.page.waitForSelector('meta[property="product:price:amount"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('meta[property="product:price:amount"]', elem => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}