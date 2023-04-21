const express = require('express');

const dotenv = require("dotenv");
dotenv.config()

console.log(process.env.DATABASE_PORT);


const app = express()

const port = process.env.PORT || 8002

app.get('/', (req, res)=>{
    console.log('Welcome to my Library App!')
})

app.listen(port, ()=>{
    console.log(`Listening to my LibraryApp on port ${port}`)
})
