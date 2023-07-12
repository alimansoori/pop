import axios from 'axios'

export async function updateAmazonsByKeepa() {
    const condition = true
    while (condition) {
        try {
            await axios.post('http://localhost:3000/api/1.0/keepa')
        } catch (e: any) {
            console.log(e.message)
        }
    }
}

updateAmazonsByKeepa()
