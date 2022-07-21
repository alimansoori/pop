import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

async function main() {
    try {

        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.hardwareandtools.com/crescent-193610cvsmn-10-7-16-inch-heavy-duty-fence-tool-solid-joint-pliers-with-cushion-grip-vvwc-4320.html"
        )
        await store.scrape()
        console.log("Source Price is: " + store.getPrice())
        console.log("Source is in stock: " + store.isAvailability())

        /*const keepa = new Keepa({
            asin: "B00BUTD1XS",
            sourcePrice: 7.87
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