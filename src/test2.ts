import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.beautance.com/makeup/2311-tarte-cosmetics-shape-tape-contour-concealer-light-0846733016129.html"
        )

        await store.scrape()
        store.productIsExist() ? console.log("Product Exist!") : console.log("Product Not Exist!")
        console.log("Source Price is: " + store.getPrice())
        console.log("Source is in stock: " + store.isAvailability())

    } catch (e: any) {
        console.log(e.message)
    }
}

main()