import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.walgreens.com/store/c/purpose-gentle-skin-cleansing-bar/ID=prod6191074-product"
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