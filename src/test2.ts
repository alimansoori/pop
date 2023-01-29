import SourceSiteFactory from './stores/SourceSiteFactory'

export async function main() {
    try {
        /*const doc = new Doc()
        await doc.auth()*/
        /*const res = await MyPostmanRequest.request(
            'https://www.bhphotovideo.com/c/product/1507458-REG/ilford_1179585_multigrade_rc_deluxe_paper.html'
        )*/
        // console.log(res)

        const store = await SourceSiteFactory.create(
            'https://www.tanga.com/deals/91f1a0440cc7/3-in-1-anti-aging-soothing-retinol-face-serum-night-moisturizer-and-eye-cream-gift-set'
        )

        await store.createBrowser()
        await store.scrape()
        console.log('Error: ' + store.error)
        console.log('Status Code: ' + store.statusCode)
        console.log('Source Price is: ' + store.getPrice())
        console.log('Source is in stock: ' + store.isAvailability())
        await store.browser?.close()

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
