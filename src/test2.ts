import SourceSiteFactory from './stores/SourceSiteFactory'
import Doc from './sheets/Doc'

export async function main() {
    try {
        const doc = new Doc('1')
        await doc.auth()
        /*const store = await SourceSiteFactory.create(
            'https://bicyclewarehouse.com/products/sram-pg-1050-10-speed-cassette'
        )

        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
