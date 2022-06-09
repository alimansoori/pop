import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Mardel extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('span[itemprop="availability"]', {timeout: 10000})
            const availability = await this.page.$eval('span[itemprop="availability"]', elem => elem.getAttribute('content'))

            if (availability === 'In stock') {
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
            await this.page.waitForSelector('span[class="current sale-price sale-price-copy"]', {timeout: 3000})
            const price = textToNumber(
                await this.page.$eval('span[class="current sale-price sale-price-copy"]', elem => elem.textContent)
            )

            if (price) this.setPrice(price)
            else {
                await this.page.waitForSelector('span[class="current current-price-copy"]', {timeout: 3000})
                const price2 = textToNumber(
                    await this.page.$eval('span[class="current current-price-copy"]', elem => elem.textContent)
                )
                this.setPrice(price2)
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}