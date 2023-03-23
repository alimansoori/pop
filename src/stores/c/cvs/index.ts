import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'
import { sleep } from '../../../utils/sleep'

export default class Cvs extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = false
        this.excludeAssets = [
            'https://display.ugc.bazaarvoice.com/static/CVSPharmacy/all_route/bvapi.js',
            'https://www.cvs.com/O7cVhH/D/W/6KBX2707fw/7zc1kbwb5u/THp9R0IHcgQ/MT/0LFQgTMVc',
            // 'https://display.ugc.bazaarvoice.com',
            'https://api.bazaarvoice.com/data/products.json',
            'https://www.cvs.com/shop-assets/js/VisitorAPI.js',
            'https://content.syndigo.com',
            'https://www.cvs.com/RETAGPV2',
            'https://www.cvs.com/RETAGPV2/StoreDetailsActor/V1/manageStore',
            'https://www.cvs.com/shop-assets',
            'https://www.cvs.com/RETAGPV1',
            'https://www.cvs.com/RETAGPV3',
            'https://www.cvs.com/RETAGPV4',
        ]
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1[role="heading"]')
    }

    async availibilityCalculate(): Promise<void> {
        try {
            await sleep(5000)
            await this.page.waitForSelector('div[aria-label="Shipping"]', { timeout: 10000 })
            await this.page.click('div[aria-label="Shipping"]')
            await sleep(1000)
        } catch (e: any) {
            console.log(e.message)
        }

        await this.checkAvailability({
            selector: 'div[data-class="pdp-add-to-basket-btn"]',
            render: 'text',
            outputArray: ['add for shipping'],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.r-1khnkhu.r-1jn44m2.r-3i2nvb',
            render: 'text',
        })
    }
}
