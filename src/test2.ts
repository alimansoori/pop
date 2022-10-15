import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'

export async function main() {
    try {
        const pup = new MyPuppeteer()
        await pup.build()
        const page = pup.page
        const store = await SourceSiteFactory.create(
            page,
            'https://www.discountbandit.com/t-h-marine-prop-master-prop-stop-propeller-stop-pmps1dp.html'
        )

        await store.scrape()
        store.productIsExist() ? console.log('Product Exist!') : console.log('Product Not Exist!')
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
