import GoogleSheets from "./sheets/GoogleSheets";
import {myPage} from "./lib/MyPage";
import AmzLogin from "./amazon/AmzLogin";
import ProfitRoiCalculate from "./lib/ProfitRoiCalculate";
import Keepa from "./lib/Keepa";
import MyDate from "./lib/MyDate";
import SourceSiteFactory from "./stores/SourceSiteFactory";
import {askQuestion} from "./lib/helper";
import sleep from "./utils/sleep";

async function main() {
    try {

        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://vminnovations.com/collections/sporting-goods/products/yardgames-giant-tumbling-wood-stacking-game-56-natural-pine-blocks-open-box"
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