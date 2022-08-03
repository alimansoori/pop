import Store from "../../Store";
import {Page} from "puppeteer";

export default class Airgas extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('button[data-enable-add-to-cart="true"]', {timeout: 10000})
            const availability = await this.page.$eval('button[data-enable-add-to-cart="true"]', elem => elem.getAttribute('type'))

            if (availability === "submit") {
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
            await this.page.waitForSelector('script[type="application/ld+json"]', {timeout: 10000})
            const jsonSchemas = await this.page.$$eval('script[type="application/ld+json"]', elem => elem.map(el => el.textContent))
            for (let i = 0; i < jsonSchemas.length; i++) {
                const jsonSchemaParse = JSON.parse(jsonSchemas[i] as string)
                if (jsonSchemaParse?.offers?.price) {
                    this.setPrice(jsonSchemaParse?.offers?.price)
                }
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}