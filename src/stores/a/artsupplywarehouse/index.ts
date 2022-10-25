import Store from '../../Store'

export default class Artsupplywarehouse extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="text/ld+json"]', { timeout: 10000 })
            const jsonSchemas = await this.page.$$eval('script[type="text/ld+json"]', (elem: any) =>
                elem.map((el: any) => el.textContent)
            )
            for (let i = 0; i < jsonSchemas.length; i++) {
                const jsonSchemaParse = JSON.parse(jsonSchemas[i] as string)
                if (
                    jsonSchemaParse?.offers?.availability === 'http://schema.org/InStock' ||
                    jsonSchemaParse?.offers?.availability === 'https://schema.org/InStock' ||
                    jsonSchemaParse?.offers?.availability === 'InStock'
                ) {
                    this.setAvailability(true)
                }
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="text/ld+json"]', { timeout: 10000 })
            const jsonSchemas = await this.page.$$eval('script[type="text/ld+json"]', (elem: any) =>
                elem.map((el: any) => el.textContent)
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
