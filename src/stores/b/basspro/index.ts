import Store from "../../Store";
import {Page} from "puppeteer";

export default class Basspro extends Store {
    constructor(page: Page, url: string) {
        super(page, url);
    }

    async productExistCalculate(): Promise<void> {
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', {timeout: 10000})
            const jsonSchemas = await this.page.$$eval('script[type="application/ld+json"]', elem => elem.map(el => el.textContent))
            for (let i = 0; i < jsonSchemas.length; i++) {
                // @ts-ignore
                const jsonSchemaParse = JSON.parse(jsonSchemas[i])
                console.log(jsonSchemaParse)
                /*if (jsonSchemaParse?.offers) {
                    if (jsonSchemaParse?.offers?.availability === 'https://schema.org/InStock' || jsonSchemaParse?.offers?.availability === 'http://schema.org/InStock') {
                        this.setAvailability(true)
                    } else if (jsonSchemaParse?.offers[0]['availability'] === 'https://schema.org/InStock' || jsonSchemaParse?.offers[0]['availability'] === 'http://schema.org/InStock') {
                        this.setAvailability(true)
                    }
                }*/
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
                // @ts-ignore
                const jsonSchemaParse = JSON.parse(jsonSchemas[i])
                /*if (jsonSchemaParse?.offers) {
                    if (jsonSchemaParse?.offers?.price) {
                        this.setPrice(jsonSchemaParse?.offers?.price)
                    } else if (jsonSchemaParse?.offers[0]['price']) {
                        this.setPrice(jsonSchemaParse?.offers[0]['price'])
                    }
                }*/
            }
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}