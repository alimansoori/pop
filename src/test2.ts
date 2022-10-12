import SourceSiteFactory from './stores/SourceSiteFactory'
import { MyPuppeteer } from './lib/MyPuppeteer'

export async function main() {
    try {
        const pup = new MyPuppeteer()
        await pup.build()
        const page = pup.page

        // await page.goto('https://www.swansonvitamins.com/p/nature-made-prenatal-multi-90-tabs')
        const store = await SourceSiteFactory.create(
            page,
            'https://www.walmart.com/ip/KEVIN-MURPHY-Night-Rider-Matte3-4-oz-100-g/1470571557'
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
