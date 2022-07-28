import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";
import Keepa from "./lib/Keepa";

async function main() {
    try {

        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.walmart.com/ip/Funko-POP-Movies-Hamilton-Alexander-Hamilton-Blue-Coat-Walmart-Exclusive/511577000"
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