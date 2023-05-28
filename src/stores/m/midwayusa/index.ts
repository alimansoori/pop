import Store from '../../Store'

export default class Midwayusa extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div[id="product-page-app-root"] h1')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }

    async priceCalculate(): Promise<void> {
        try {
            if (!this.getPrice() || typeof this.getPrice() !== 'number') {
                const content = await this.page.$eval(
                    'div.product-item-information div.priceblock span.sr-only',
                    (elem: any) => elem.textContent
                )

                const regex = /\d+(?:\.\d+)?/g
                const prices = content?.match(regex)
                if (prices && Array.isArray(prices)) {
                    this.setPrice(prices[prices.length - 1])
                }
            }
        } catch (e: any) {
            console.log(e.message)
        }
    }
}
