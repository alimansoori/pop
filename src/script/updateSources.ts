import axios from 'axios'
import { tomorrowDate, writeSetting } from '../lib/helper'
import MyDate from '../lib/MyDate'
import Keepa from '../lib/Keepa'
import IStore from '../stores/IStore'
import SourceSiteFactory from '../stores/SourceSiteFactory'

export async function updateSources() {
    const condition = true
    while (condition) {
        try {
            const randLead = await axios.get('http://localhost:3000/api/1.0/source')

            console.log('===========================================')
            // console.log(randLead?.data?.data)
            if (!randLead?.data?.data?.source?.url) {
                console.log(`>>>> Source URL not exist`)
                continue
            }

            const store = await sourceSite(randLead?.data?.data?.source?.url)
            await store.createBrowser()
            await store.scrape()
            await store.browser?.close()
            console.log('Source Title is: ' + store.getTitleClass().getTitle())
            console.log('Source URL is: ' + store.getOriginUrl())
            console.log('Source UPC is: ' + store.getUPC())
            console.log('Source Price is: ' + store.getPrice())
            console.log('Source Image is: ' + store.getImage())
            console.log('Source Price is: ' + store.getPrice())
            console.log('Source is in stock: ' + store.isAvailability())
            console.log('Error ' + store.error)
            console.log('StatusCode ' + store.statusCode)

            if (store.statusCode === 200) {
                await axios.post('http://localhost:3000/api/1.0/source', {
                    title: store.getTitleClass().getTitle(),
                    url: store.getOriginUrl(),
                    price: store.getPrice(),
                    availability: store.isAvailability(),
                    upc: store?.getUPC(),
                    images: store.getImage(),
                })
                console.log('Update source successful!')
            }
        } catch (e: any) {
            console.log(e.message)
        }
    }
}

async function sourceSite(url: string): Promise<IStore> {
    const store = await SourceSiteFactory.create(url)
    console.log(store.getDomain())

    return store
}

updateSources()
