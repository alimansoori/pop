import SourceSiteFactory from './stores/SourceSiteFactory'
import Doc from './sheets/Doc'

export async function main() {
    try {
        /*const doc = new Doc('1')
        await doc.auth()*/

        const store = await SourceSiteFactory.create(
            'https://toyplace.com/products/fishing-sim-world-pro-tour-collectors-edition-for-playstation-4'
        )
        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Title is: ' + store.getTitleClass().getTitle())
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source Image is: ' + store.getImage())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
