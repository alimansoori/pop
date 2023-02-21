import SourceSiteFactory from './stores/SourceSiteFactory'
import Doc from './sheets/Doc'

export async function main() {
    try {
        /*const doc = new Doc('1')
        await doc.auth()*/

        const store = await SourceSiteFactory.create(
            'https://www.beachaudio.com/sniper-elite-4-u-i-entertainment-swiuie01520/'
        )
        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
