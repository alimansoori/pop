import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bullmoose extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.DOC_LOADED
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h2.productdetailtitle1 ')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h2.productdetailtitle1 ',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '*[itemprop="image"]',
            render: 'src',
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: '*[itemprop="availability"]',
            render: 'href',
            outputArray: [],
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: '*[itemtype="http://schema.org/Offer"] > *[itemprop="price"]',
            render: 'text',
        })
    }
}
