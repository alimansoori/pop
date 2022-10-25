import Store from '../../Store'

export default class Basspro extends Store {
    constructor(url: string) {
        super(url)
    }

    async productExistCalculate(): Promise<void> {}

    async availibilityCalculate(): Promise<void> {}

    async priceCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 })
        } catch (e: any) {
            this.setPrice(NaN)
        }
    }
}
