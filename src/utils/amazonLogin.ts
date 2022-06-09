import {Page} from "puppeteer";
import sleep from "./sleep";

async function amazonLogin(page: Page): Promise<boolean> {
    try {
        await page.goto('https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0')
        await page.type("input#ap_email", "alimanssouri221@gmail.com")
        await page.click("input#continue")
        await sleep(2000)
        await page.waitForSelector("input#ap_password")
        await page.type("input#ap_password", "U-rv-g4Ji5#j@L6")
        await page.click("input#signInSubmit")
        await page.waitForFunction("window.location.pathname == '/'")
    } catch (err) {
        console.log('amazonLogin.ts Error: ', err)
        return false
    }

    console.log('>>>> Amazon Login Success!')
    return true
}

export default amazonLogin

/*function extract() {
    const extractItems = Array.from(
        document.querySelectorAll("table div.MNU")
    )
    const items = extractItems.map(elem => elem.innerText)
    return items
}*/