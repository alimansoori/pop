import express from 'express'
import Google from './lib/Google'

const app = express()

app.use(express.json())

app.get('/api/1.0/search-engine', async (req, res) => {
    const title = req.query?.title
    if (!title || typeof title !== 'string') {
        return res.status(400).send()
    }
    const google = new Google({
        title,
    })

    await google.search2()

    res.send(google.getAsins())
})

export default app
