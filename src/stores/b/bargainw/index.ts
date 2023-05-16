import Store from '../../Store'

export default class Bargainw extends Store {
    constructor(url: string) {
        super(url)
        this.scrapUntilBlock = true
    }

    async productExistCalculate(): Promise<void> {
        await this.productExistBySelector('div.details_cateory_name')
    }

    async productImageCalculate(): Promise<void> {
        await this.setImage({
            selector: 'div.details_image_box img, div.details_image_thumbnails img',
            render: 'src',
            multiple: true,
        })
    }

    async availibilityCalculate(): Promise<void> {
        await this.checkMetaByClassSchemas('script[type="application/ld+json"]')
        await this.checkAvailability({
            selector: 'button.addToCart_btn',
            render: 'text',
            outputArray: [],
        })
    }
}
