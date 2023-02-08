import SourceSiteFactory from './stores/SourceSiteFactory'
import Doc from './sheets/Doc'

export async function main() {
    try {
        /*const doc = new Doc('1')
        await doc.auth()*/

        let title = '10 pack on 20 pack in door'
        title = title.replace(/[0-9]{1,}[\s](pack)(\s?)/g, '')

        console.log(title)
        /*const res = await MyPostmanRequest.request(
            'https://www.bhphotovideo.com/c/product/1507458-REG/ilford_1179585_multigrade_rc_deluxe_paper.html'
        )*/
        // console.log(res)

        /*const store = await SourceSiteFactory.create(
            'https://365cycles.com/products/sram-dub-wide-english-bottom-bracket-english-bsa-68mm-road-black'
        )

        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()*/

        /*const keepa = new Keepa({
            asin: 'B086763VT8',
            sourcePrice: 22.04,
        })
        await keepa.fetchByKeepa()
        console.log(keepa.sellPrice)
        console.log(keepa.avgBuyBox30Day)
        console.log(keepa.size)
        console.log(keepa?.hasBadge)
        console.log(keepa.buyBoxIsAmazon)*/
    } catch (e: any) {
        console.log(e.message)
    }
}

main()
