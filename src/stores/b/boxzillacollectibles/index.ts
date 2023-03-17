import Store from '../../Store'

export default class Boxzillacollectibles extends Store {
    constructor(url: string) {
        super(url)
        // this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        // await this.productExistBySelector('')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await this.page.waitForSelector('div.tt-wrapper button.btn-addtocart > span:nth-child(2)', {
                timeout: 10000,
            })
            const availability = await this.page.$eval(
                'div.tt-wrapper button.btn-addtocart > span:nth-child(2)',
                (elem: any) => elem.textContent
            )

            if (availability?.toLowerCase().includes('add to cart')) {
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
