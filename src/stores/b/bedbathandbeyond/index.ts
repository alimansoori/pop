import Store from "../../Store";
import {Page} from "puppeteer";
import {textToNumber} from "../../../lib/helper";

export default class Bedbathandbeyond extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[id="schemaGraph"]', {timeout: 10000})
            const jsonSchema = await this.page.$eval('script[id="schemaGraph"]', elem => elem.textContent)
            if (jsonSchema) {
                const jsonSchemaParse = JSON.parse(jsonSchema)
                if (jsonSchemaParse['@graph'][3]['offers']['availability'] === 'https://schema.org/InStock') {
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
            await this.page.waitForSelector('script[id="schemaGraph"]', {timeout: 10000})
            const jsonSchema = await this.page.$eval('script[id="schemaGraph"]', elem => elem.textContent)
            if (jsonSchema) {
                const jsonSchemaParse = JSON.parse(jsonSchema)
                if (jsonSchemaParse['@graph'][3]['offers']['price']) {
                    this.setPrice(textToNumber(jsonSchemaParse['@graph'][3]['offers']['price']))
                } else if (jsonSchemaParse['@graph'][3]['offers']['highPrice']) {
                    this.setPrice(textToNumber(jsonSchemaParse['@graph'][3]['offers']['highPrice']))
                } else {
                    this.setPrice(NaN)
                }
            }

        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}