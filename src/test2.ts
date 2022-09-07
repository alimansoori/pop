import {myPage} from "./lib/MyPage";
import SourceSiteFactory from "./stores/SourceSiteFactory";

export async function main() {
    try {
        const page = await myPage()
        const store = await SourceSiteFactory.create(
            page,
            "https://gamersguildaz.com/products/warhammer-40k-tyranids-parasite-of-mortrex-2022-pre-order"
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