import Store from '../../Store'

export default class Gearx extends Store {
    constructor(url: string) {
        super(url)
        this.runPostman = true
        this.siteIsBlocked = true
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailibilityBySchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        await this.checkPriceBySchemas('script[type="application/ld+json"]')
    }
}
