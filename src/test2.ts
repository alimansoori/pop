import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://toywiz.com/marvel-legends-the-unbeatable-squirrel-girl-action-figure-vehicle/"
        )
        await store.scrape()
        console.log("Source Price is: " + store.getPrice())
        console.log("Source is in stock: " + store.isAvailability())

        /*const keepa = new Keepa({
            asin: "B00ZQG7VDM",
            sourcePrice: 2.67
        })
        await keepa.fetchByKeepa()

        console.log(keepa.category)
        console.log(keepa.profit)*/
        // console.log(keepa.data)
    } catch (e: any) {
        console.log(e.message)
    }
}

main()