const puppeteer = require("puppeteer");
const {getText} = require("../../dist/lib/helper");

describe('My First Puppeteer Test', () => {
    it('should launch the browser', async function () {
        const paths = "C:\\Users\\Lion\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\gobliffocflfaekfcaccndlffkhcafhb\\2.5.3_0\\"
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 10,
            devtools: false,
            executablePath: "C:\\chrome-win\\chrome.exe",
            /*args: [
                `--disable-extensions-except=${paths}`,
                `--load-extension=${paths}`,
                `--window-size=800,600`
            ]*/
        })
        const page = await browser.newPage();
        // Navigate to extension page
        let url = 'https://premium.tacticalbucket.com/QPSZ1T/eJwFwQESwiAMBMAXHRWr1vE3kUbBJsCEdPi+u9m9j9eyzDlDJtsnGVPdvTUZITVdhLRL+WbHh0wH4hq3y-b-0GL0dBvKKdNTGUnQTGXSixcnV4s5SRqJbhbDiP3xuPbX2G7Cp-b-C0IqjQ==/hardwareandtools.com/p'
        await page.goto(url);

        let regex_var = new RegExp(/(\.[^\.]{0,2})(\.[^\.]{0,2})(\.*$)|(\.[^\.]*)(\.*$)/);
        let domain = ((new URL(url)).hostname).replace(regex_var, '').split('.').pop();

        console.log('Domain => ' + domain)
        if (domain === 'tacticalbucket') {
            await page.goto(url)
            url = page.url()
            console.log('URL => ' + url)
            domain = ((new URL(url)).hostname).replace(regex_var, '').split('.').pop();

            console.log('New Domain => ' + domain)
        }
    });
})