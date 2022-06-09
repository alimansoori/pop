import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Overstock extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[data-testid="add-to-cart-button"]', {timeout: 10000})
            const availability = await this.page.$eval('button[data-testid="add-to-cart-button"]', elem => elem.textContent)

            if (availability?.toLowerCase().includes("add to cart")) {
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
            await this.page.waitForSelector('span.css-1y4j0pq.e1eyx97t3', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('span.css-1y4j0pq.e1eyx97t3', elem => elem.textContent)
            )

            this.setPrice(price)
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}