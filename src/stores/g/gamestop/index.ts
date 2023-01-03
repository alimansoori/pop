import Store from '../../Store'
import sleep from '../../../utils/sleep'

export default class Gamestop extends Store {
    constructor(url: string) {
        super(url)
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('meta[name="og:title"]')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await sleep(2000)
            await this.page.waitForSelector(
                'label[data-testid="attribute-New-label"] > div:not(.attribute-strikethrough-unselected)',
                { timeout: 10000 }
            )
            await this.page.click(
                'label[data-testid="attribute-New-label"] > div:not(.attribute-strikethrough-unselected)'
            )
            await sleep(3000)

            await this.checkAvailability({
                selector: 'div:nth-child(4) > div > button.button_button__AswiG > span',
                render: 'text',
                outputArray: [],
            })
        } catch (e: any) {
            this.setAvailability(false)
        }
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'span[data-testid="price-default"]',
            render: 'text',
        })
    }
}
