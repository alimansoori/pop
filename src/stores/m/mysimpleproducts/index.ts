import Store from "../../Store";
import {Page} from "puppeteer";
import {categories} from "./categories";
import {textToNumber} from "../../../lib/helper";

export default class Mysimpleproducts extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div[title="Availability"] div.instock span', {timeout: 10000})
            const availability = await this.page.$eval('div[title="Availability"] div.instock span', elem => elem.textContent)

            if (availability === "In stock!") {
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
            await this.page.waitForSelector('meta[property="product:price:amount"]', {timeout: 5000})
            const price = textToNumber(
                await this.page.$eval('meta[property="product:price:amount"]', elem => elem.getAttribute('content'))
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}