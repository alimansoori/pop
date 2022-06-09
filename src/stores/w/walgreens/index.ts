import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Walgreens extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', {timeout: 10000})
            const jsonSchema = await this.page.$eval('script[type="application/ld+json"]', elem => elem.textContent)
            if (jsonSchema) {
                const jsonSchemaParse = JSON.parse(jsonSchema)
                if (jsonSchemaParse['offers'][0]['availability'] === 'http://schema.org/InStock') {
                    this.setAvailability(true)
                } else {
                    this.setAvailability(false)
                }
            }

        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', {timeout: 10000})
            const jsonSchema = await this.page.$eval('script[type="application/ld+json"]', elem => elem.textContent)
            if (jsonSchema) {
                const jsonSchemaParse = JSON.parse(jsonSchema)
                if (jsonSchemaParse['offers'][0]['price']) {
                    this.setPrice(textToNumber(jsonSchemaParse['offers'][0]['price']))
                } else if (jsonSchemaParse['offers'][0]['highPrice']) {
                    this.setPrice(textToNumber(jsonSchemaParse['offers'][0]['highPrice']))
                } else {
                    this.setPrice(NaN)
                }
            }

        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}