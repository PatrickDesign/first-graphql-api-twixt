const express = require('express')

const PORT = process.env ? process.env.PORT : 3000

const app = express()

app.get('/', (req, res) => {
    res.send('posts');
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
