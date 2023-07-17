import axios from 'axios'
import IStore from '../stores/IStore'
import SourceSiteFactory from '../stores/SourceSiteFactory'

export async function updateSources() {
    const condition = true
    while (condition) {
        try {
            const randLead = await axios.get('http://localhost:3000/api/1.0/source')
            console.log('===========================================')

            try {
                if (!randLead?.data?.data?.source?.url) {
                    console.log(`<<<<<<<<< Source URL not exist >>>>>>>>>`)
                    continue
                }

                console.log('Start: ' + !randLead?.data?.data?.source?.url)

                const store = await sourceSite(randLead?.data?.data?.source?.url)
                await store.createBrowser()
                await store.scrape()
                await store.browser?.close()
                console.log('Source Title is: ' + store.getTitleClass().getTitle())
                console.log('Source URL is: ' + store.getOriginUrl())
                console.log('Source Canonical is: ' + store.getUrl())
                console.log('Source UPC is: ' + store.getUPC())
                console.log('Source Price is: ' + store.getPrice())
                console.log('Source Image is: ' + store.getImage())
                console.log('Source Price is: ' + store.getPrice())
                console.log('Source is in stock: ' + store.isAvailability())
                console.log('Error ' + store.error)
                console.log('StatusCode ' + store.statusCode)

                if (store.statusCode === 200 && !store.error && store.getPrice()) {
                    await axios.post('http://localhost:3000/api/1.0/source', {
                        title: store.getTitleClass().getTitle(),
                        url: store.getOriginUrl(),
                        canonical: store.getUrl(),
                        price: store.getPrice(),
                        availability: store.isAvailability(),
                        upc: store?.getUPC(),
                        images: store.getImage(),
                        note: store?.error,
                    })
                    console.log('Update source successful!: ' + store.getUrl())
                }
            } catch (e: any) {
                await axios.post('http://localhost:3000/api/1.0/source', {
                    url: !randLead?.data?.data?.source?.url,
                    note: 'Error in updateSources: ' + e.message,
                })
            }
        } catch (e: any) {
            console.log('Error in updateSources: ' + e.message)
        }

        console.log('<<<<<<< END >>>>>>>>>')
    }
}

async function sourceSite(url: string): Promise<IStore> {
    const store = await SourceSiteFactory.create(url)
    console.log(store.getDomain())
    console.log(store.getUrl())

    return store
}

updateSources()
