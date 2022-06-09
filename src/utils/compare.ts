import {Page} from "puppeteer";
import Jimp = require("jimp");
import fs = require("fs")

async function compare(page: Page, img1: string, img2: string) {

    let image1: Jimp
    let image2: Jimp

    try {
        image1 = await Jimp.read(img1)
            .then((image:any) => {
                return image
            })
            .catch(async (err: any) => {
                let viewSource = await page.goto(img1);
                const imgSource = await viewSource.buffer()
                return await Jimp.read(imgSource).catch((err:any) => {
                    throw err
                })
            })
    } catch (e: any) {
        image1 = await webpImageProcess(img1)
    }

    try {
        image2 = await Jimp.read(img2)
            .then((image: any) => {
                return image
            })
            .catch(async (err: any) => {
                let viewSource = await page.goto(img2);
                const imgSource = await viewSource.buffer()
                return await Jimp.read(imgSource).catch((err: any) => {
                    throw err
                })
            })
    } catch (e: any) {
        image2 = await webpImageProcess(img2)
    }

    return {
        distance: Jimp.distance(image1, image2),
        diff: Jimp.diff(image1, image2, 0.1)
    }
}

async function webpImageProcess(imgUrl: string): Promise<Jimp> {
    // Get .webp image
    const webp = require('webp-converter');
    const http = require('https');

    console.log(imgUrl)
    /*await download(imgUrl, './tmp/google.webp', function(){
        console.log('download done');
    })*/

    return new Promise(async (resolve, reject) => {
        // Check if .webp, requires additional handling
        // Get .webp image

        const file = fs.createWriteStream("./tmp/tmp.webp");
        const request = http.get(imgUrl, async function (response: any) {
            await response.pipe(file); // Save to tmp.webp
            let result = await webp.dweb("./tmp/tmp.webp", "./tmp/tmp.png", "-o"); // Convert to tmp.webp -> tmp.png
            let img = await Jimp.read('./tmp/tmp.png') // Read tmp.png for jimp
            fs.unlink("./tmp/tmp.webp", () => {
            }); // Remove tmp.webp
            fs.unlink("./tmp/tmp.png", () => {
            }); // Remove tmp.png
            resolve(img); // Resolve image converted to image/png
        });
    });
}

async function download(uri: string, filename: string, callback: any){
    const request = require('request');

    request.head(uri, function(err: any, res: any, body: any){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

export default compare