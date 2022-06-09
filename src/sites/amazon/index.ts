import puppeteer, {Page} from "puppeteer"
import save2csv from "../../utils/save2csv";
import categories from "../5-katom/categories";
import fs from "fs"

import {
    amazonData,
    click, compareImages,
    getText,
    getValue, initPage,
    loginRevseller,
    loginSellerAssistantAppWarn, removeParamsUrl,
    shouldNotExist, textToNumber,
    typeText
} from "../../lib/helper";

import {logins, scrapeSites} from "../../lib/scrapeSites";
import {fetchDataAzInsight} from "./azInsight";

async function main() {
    const page = await initPage()

    const xlsxs = fs.readdirSync('./xlsx/')
    let XLSX = require('xlsx');


    if (xlsxs.length) {
        await logins(page)
        for (let i = 0; i < xlsxs.length; i++) {
            let workbook = XLSX.readFile('./xlsx/' + xlsxs[i]);
            let sheet_name_list = workbook.SheetNames;
            let resultXLSX = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
            let sourcePrice = 0
            for (let j = 0; j < resultXLSX.length-1; j++) {

                console.log('<<<<< Start >>>>>')
                /*if (
                    resultXLSX[j]['Product Image'] && resultXLSX[j]['Amazon Image'] &&
                    !await compareImages(page, resultXLSX[j]['Product Image'], resultXLSX[j]['Amazon Image'])
                ) {
                    console.log('>>>> Reject => Images MisMatch')
                    continue
                }*/

                const sourceData = await scrapeSites(
                    page,
                    resultXLSX[j]['Source URL']
                )

                sourcePrice = sourceData?.price ? sourceData.price : 0
                if (sourceData?.error) {console.log('>>>> Reject By Error: '+ sourceData?.error); continue}
                if (!sourceData?.price && resultXLSX[j]['Price']) {
                    console.log('Use Cache Price: ' + textToNumber(resultXLSX[j]['Price']))
                    sourcePrice = textToNumber(resultXLSX[j]['Price'])
                }
                if (!sourceData?.price && !resultXLSX[j]['Price']) {console.log('>>>> Reject Null source price'); continue}

                console.log("Start Scrape Amazon: " + resultXLSX[j]['Amazon URL'])
                // const amzData = await amazonData(page, sourcePrice.toString(), resultXLSX[j]['Amazon URL'])
                let amzData
                try {
                    amzData = await fetchDataAzInsight(page, resultXLSX[j]['Amazon URL'], sourcePrice)
                } catch (e: any) {
                    continue
                }

                console.log(amzData)
                // @ts-ignore
                if (amzData?.size && amzData?.size === 'oversize') {console.log('>>>> Reject by size: ' + amzData?.size); continue}
                if (amzData?.sellPrice < 5) {console.log('Reject by sellPrice: ' + amzData?.sellPrice); continue}
                if (amzData?.ip) {console.log('>>>> Reject by IP Complains: ' + amzData?.ip); continue}
                if (amzData?.net < 4) {console.log('>>>> Reject by Net: ' + amzData?.net); continue}
                if (amzData?.roi < 30) {console.log('>>>> Reject by ROI: ' + amzData?.roi); continue}
                if (amzData?.top > 1.5) {console.log('>>>> Reject by Top: ' + amzData?.top); continue}
                if (amzData?.variations > 4) {console.log('>>>> Reject by Variations: ' + amzData?.variations); continue}
                if (amzData?.amz) {console.log('>>>> Reject by AMZ Price: ' + amzData?.amz); continue}
                if (!amzData?.badge30) {console.log('>>>> Reject by Badge 30 Day: ' + amzData?.badge30); continue}

                console.log('<<<<< ADD >>>>>')
                save2csv('Leads.csv', [{
                    sourceUrl: resultXLSX[j]['Source URL'],
                    amzUrl: resultXLSX[j]['Amazon URL'],
                    // img: products[i].img,
                    // title: products[i].title,
                    // availability: products[i].availability,
                }])
            }
        }
    }


    /*const page = await initPage()

    await loginSellerAssistantAppWarn(page)
    await loginRevseller(page)

    await page.goto('https://www.amazon.com/dp/B08SCMXJDB/')

    console.log(await amazonData(page, '12', 'https://www.amazon.com/dp/B08SCMXJDB/'))*/
}

main().then(r => console.log('>>>> End Scraping Amazon'))