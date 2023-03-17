import Store from '../../Store'

export default class Airgas extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.product-information h2')
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        try {
            await this.page.waitForSelector('button[data-enable-add-to-cart="true"]', { timeout: 10000 })
            const availability = await this.page.$eval('button[data-enable-add-to-cart="true"]', (elem: any) =>
                elem.getAttribute('type')
            )

            if (availability === 'submit') {
                this.setAvailability(true)
            } else {
                this.setAvailability(false)
            }
        } catch (e: any) {
            this.setAvailability(false)
        }
    }
}
