import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://www.opentip.com/Coleman-Rain-Jacket-Coleman-Youth-S-M-Blue-2000014629-p-8845720.html"
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