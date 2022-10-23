import Store from '../../Store'
import { Browser, Page } from 'puppeteer'

export default class Aclens extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 })
            const jsonSchemas = await this.page.$$eval('script[type="application/ld+json"]', (elem) =>
                elem.map((el) => el.textContent)
            )
            for (let i = 0; i < jsonSchemas.length; i++) {
                const jsonSchemaParse = JSON.parse(jsonSchemas[i] as string)
                if (jsonSchemaParse?.offers?.availability === 'http://schema.org/InStock') {
                    this.setAvailability(true)
                }
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 })
            const jsonSchemas = await this.page.$$eval('script[type="application/ld+json"]', (elem) =>
                elem.map((el) => el.textContent)
            )
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
