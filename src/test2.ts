import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.fugitivetoys.com/products/fruits-basket-pop-vinyl-figure-tohru-honda-879?currency=USD&variant=32332074877030&utm_medium=cpc&utm_source=google&utm_campaign=Google%20Shopping"
        )

        await store.scrape()
        console.log("Source Price is: " + store.getPrice())
        console.log("Source is in stock: " + store.isAvailability())

    } catch (e: any) {
        console.log(e.message)
    }
}

main()