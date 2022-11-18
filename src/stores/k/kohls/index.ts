import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import sleep from '../../../utils/sleep'

export default class Kohls extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[class="product-title"]')
    }

    async availibilityCalculate(): Promise<void> {
        /*try {
            await this.page.waitForSelector('div[class="pdp-colorSwatches-dropdown"]')
            await this.page.click('div[class="pdp-colorSwatches-dropdown"]')

            await sleep(2000)
            const [textElems] = await this.page.$x(
                "//div[contains(@class, 'pdp-colorSwatches-dropdown')]//ul//a[contains(.,'Power Boost')]"
            )

            if (textElems) {
                // @ts-ignore
                await textElems.click()
            }
        } catch (e: any) {
            console.log(e.message)
        }*/

        await this.checkAvailability({
            selector: 'meta[itemprop="availability"]',
            render: 'content',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'meta[itemprop="price"]',
            render: 'content',
        })
    }
}
