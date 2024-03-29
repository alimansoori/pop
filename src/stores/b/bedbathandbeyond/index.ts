import Store from '../../Store'

import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bedbathandbeyond extends Store {
    constructor(url: string) {
        super(url)
        this.url = this.getUrl().replace(/(\/amp)/g, '')
        this.url = this.getUrl().replace('bedbathandbeyond.com', 'bedbathandbeyond.com/amp')
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.prodTitle')
    }

    async productTitleCalculate(): Promise<void> {
        await this.setTitle({
            selector: 'h1.prodTitle',
            render: 'text',
        })
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: '*[id="prodSlideCarouselSkuFallback"] img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkAvailability({
            selector: 'div.shipItBtnCont > a',
            render: 'text',
        })
    }

    async priceCalculate(): Promise<void> {
        await this.checkPrice({
            selector1: 'div.trackIsPrice',
            render: 'text',
        })
    }
}
