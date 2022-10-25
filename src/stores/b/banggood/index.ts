import Store from '../../Store'

export default class Banggood extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.product-action a.add-cart-btn', { timeout: 10000 })
            const availability = await this.page.$eval('div.product-action a.add-cart-btn', (elem: any) =>
                elem.textContent?.trim()
            )

            if (availability === 'Add to Cart') {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
