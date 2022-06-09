import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Bigbadtoystore extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('h2.ada-product-h2.ada-order-h2', {timeout: 10000})
            const availability = await this.page.$eval('h2.ada-product-h2.ada-order-h2', elem => elem.textContent)

            if (availability === "IN STOCK") {
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
            await this.page.waitForSelector('div.price', {timeout: 5000})
            const price = textToNumber(
                await this.page.$eval('div.price', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}