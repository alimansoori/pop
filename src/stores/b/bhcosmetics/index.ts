import Store from '../../Store'
import { EnumLoadType } from '../../../@types/EnumLoadType'

export default class Bhcosmetics extends Store {
    constructor(url: string) {
        super(url)
        this.loadType = EnumLoadType.LOAD
        this.scrapUntilBlock = true
        this.enableAssets = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('h1.productName_title')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector:
                'div.athenaProductPage_topRow div.athenaProductImageCarousel_imageSlider > div.athenaProductImageCarousel_imageWrapper > span',
            render: 'data-path',
            multiple: true,
        })

        await this.setImage({
            selector:
                'div.athenaProductPage_topRow div.athenaProductImageCarousel_imageSlider > div.athenaProductImageCarousel_imageWrapper > img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
    }
}
