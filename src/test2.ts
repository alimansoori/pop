import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.target.com/p/jurassic-world-amber-collection-tyrannosaurus-rex-38-compy-figures/-/A-81841660"
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