// import app from './App'

const port = process.env.PORT || 3000

// @ts-ignore
app.listen(port, (err: any) => {
    if (err) {
        return console.log(err)
    }

    return console.log(`server is listening on ${port}`)
})



// npm install --ignore-scripts